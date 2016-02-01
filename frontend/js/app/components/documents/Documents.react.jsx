import React from "react";
import DocumentStore from "../../stores/DocumentStore";
import ServerActionCreator from "../../actions/ServerActionCreator";
import DocumentsModal from "./DocumentsModal.react";

export default class Documents extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            documentList: [],
            showModal: false,
            doc : null,
            documentId : null,
            status : null,
            status_note : null
        };

        this._onChange = this._onChange.bind(this);
        this.handleDownloadClick = this.handleDownloadClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);

        console.log('constructor');
    }

    _onChange () {
        var i = 1;
        let list = null;

        switch (this.props.type) {
            case "entity": {
                list = DocumentStore.getForEntity(this.props.target);
                break;
            }

            case "loan": {
                list = DocumentStore.getForLoan(this.props.target);
                break;
            }

            case "collateral": {
                list = DocumentStore.getForCollateral(this.props.target);
                break;
            }

            default:
                list = DocumentStore.getAll();
            }

        if (list !== null) {
        this.setState({documentList: list});
        
        }
    }

    componentDidMount () {
        DocumentStore.addChangeListener(this._onChange);
        this._onChange();
    }

    componentWillUnmount () {
        DocumentStore.removeChangeListener(this._onChange);
    }

    handleDownloadClick (doc) {
        $.ajax({
            type: 'GET',
            url: frontendSettings.endpoints.documents + "/" + doc.id,

            beforeSend: (xhr) => {
                xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
            },

            success: (result) => {
                let file = result.result;
                console.log(result);
                //if (this.isMounted()) {
                let a = document.createElement("a");
                document.body.appendChild(a);

                // let ab = new ArrayBuffer(file.data.data.length);
                // let view = new Uint8Array(ab);
                // for (let i = 0; i < file.data.data.length; ++i) {
                //   view[i] = file.data.data[i];
                // }

                // let blob = new Blob([ab]),
                //   url = window.URL.createObjectURL(blob);

                let url = file.url;

                a.href = url;
                a.download = file.filepath;
                a.click();
                window.URL.revokeObjectURL(url);
                //}
            },

            error: (result) => {
                console.log("error:");
                console.log(result);
                if (result.status === 403) {
                    window.location.replace("/login.html");
                }
            }
        });
    }

    handleRemoveClick (document) {
        ServerActionCreator.deleteDocument(document);
    }

    handleHideModal(status){
        var self = this,
        param = null,
        target = this.props.target;

        this.setState({showModal: false});
        switch (this.props.type) {
            case "entity": {
                param='for_loan';
                break;
            }

            case "loan": {
                param='for_loan';
                break;
            }

            case "collateral": {
                param='for_collateral'
                break;
            }

            default: {
                param=null;
                break;  
            }
        }

        $.ajax({
            type: 'GET', 
            url: frontendSettings.endpoints.documents + "/" + param + "/" + target,
            dataType: 'json',

            beforeSend: function(xhr) {
                xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
            },

            success: function(result) {
                self.setState({documentList:result.result});
            },

            error: function(result) {
                console.log("error:");
                console.log(result);
                if (result.status === 403) {
                    window.location.replace("/login.html");
                }
            }
                    
        });


    }
    
    handleShowModal(document){
        let temp = this;
        temp.setState({showModal: true});
        temp.setState({documentId: document.id,status : document.status, status_note : document.status_note});
    }

    render () {
        var documentId = null;
        return (
            <span>
                {this.props.type !== "collateral"
                ? <h3 className="btn-righticon">
                    Documents
                    </h3>
                : ''}

                {this.state.documentList.map((document) => {
                    return (
                        <div className="btn-group" key={document.id}>
                            {document.status=="1"?
                            <button data-toggle="dropdown" className="btn btn-outline btn-primary dropdown-toggle" aria-expanded="false">
                                <i className="fa fa-file-image-o"></i>&nbsp;{document.filename}&nbsp;
                                <span className="caret"></span>
                            </button>: document.status=="0"?
                            <button data-toggle="dropdown" className="btn btn-outline btn-warning dropdown-toggle" aria-expanded="false">
                                <i className="fa fa-file-image-o"></i>&nbsp;{document.filename}&nbsp;
                                <span className="caret"></span>
                            </button>:
                            <button data-toggle="dropdown" className="btn btn-outline btn-danger dropdown-toggle" aria-expanded="false">
                                <i className="fa fa-file-image-o"></i>&nbsp;{document.filename}&nbsp;
                                <span className="caret"></span>
                            </button>
                            }

                            <ul className="dropdown-menu">
                                <li>
                                <a href="#" onClick={this.handleDownloadClick.bind(null, document)}>
                                    <i className="fa fa-download"></i>&nbsp;Download</a>
                                </li>
                                <li>
                                <a href="#" onClick={this.handleRemoveClick.bind(null, document)}>
                                    <i className="fa fa-remove"></i>&nbsp;Remove</a>
                                </li>
                                <li>
                                <a onClick={this.handleShowModal.bind(this,document)}>
                                    <i className="fa fa-download"></i>&nbsp;Status</a>
                                </li>
                            </ul>

                            </div>
                    );
                })}
                {this.state.showModal ? <DocumentsModal handleHideModal={this.handleHideModal.bind(this)} documentId={this.state.documentId} status={this.state.status} status_note={this.state.status_note} type={this.props.type} target={this.props.target}/> : null}
                    
            </span>
        );
    }
}

    
