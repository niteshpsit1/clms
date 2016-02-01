import React from "react";

import EntityStore from "../../stores/EntityStore";
import DocumentStore from "../../stores/DocumentStore";

import ServerActionCreator from "../../actions/ServerActionCreator";
import ApiUtils from "../../utils/ApiUtils";

export default class DocumentsUploader extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      ukey: Math.floor(Math.random() * 1000000) + 5,
      target: this.props.target
    };

    this.upload = this.upload.bind(this);
    this.setTarget = this.setTarget.bind(this);
  }

  upload () {
    if (this.state.dropzone !== undefined) {
      this.state.dropzone.processQueue();
    }
  }

  setTarget (target) {
    this.state.target = target;
  }

  componentDidMount () {
    let _self = this;
    let dropzone = new Dropzone("form#documents-uploader-" + _self.state.ukey, {

      url: "/api/documents",

      headers: {
        'x-access-token': JSON.parse(sessionStorage.getItem('user')).token
      },

      paramName: "file",
      autoProcessQueue: false,
      uploadMultiple: false,
      parallelUploads: 100,
      maxFiles: 100,
      addRemoveLinks: true,

      init: function() {
        let myDropzone = this;

        if (_self.props.type !== "collateral") {
          this.element.parentElement.querySelector("button#document-submit").addEventListener("click", function(e) {
            // Make sure that the form isn't actually being sent.
            e.preventDefault();
            e.stopPropagation();
            myDropzone.processQueue();
          });
        }

        this.on("sending", function(file, xhr, formData) {
          formData.append("owner", _self.state.target);
          formData.append("documentcode", 1);
          formData.append("documenttype_id", 1);
          formData.append("data", JSON.stringify({test: "test"}));

        });

        this.on("success", function(file, response) {
          let fileID = response.result.id;

          let requestData = {
            document_id: fileID
          };

          requestData[_self.props.type + '_id'] = _self.state.target;

          ServerActionCreator.newDocument(response.result);

          switch (_self.props.type) {
            case 'entity':
              DocumentStore.pushForEntity(requestData);
              break;
            case 'loan':
              DocumentStore.pushForLoan(requestData);
              break;
            case 'collateral':
              DocumentStore.pushForCollateral(requestData);
              break;
            default:
              //nop
          }

          $.ajax({
            type: 'POST',
            url: frontendSettings.endpoints[_self.props.type + "Document"],
            data: requestData,
            dataType: 'json',

            beforeSend: function(xhr) {
              xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
            }

          });
          DocumentStore.emitChange();
        });
      }

    });
    _self.setState({dropzone: dropzone});
  }

  componentWillUnmount () {
    this.state.dropzone.destroy();
  }

  render () {
    return (
      <div>
        <form id={"documents-uploader-" + this.state.ukey} className="dropzone dropArea">
          <div className="dropzone-previews"></div>

        </form>

        {this.props.type !== "collateral"
          ? <button type="submit" id="document-submit" className="btn btn-primary btn-lg">Submit</button>
          : ""}
      </div>
    );
  }
}
