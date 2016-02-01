import React from "react";
import ReactDOM from "react-dom";
import DocumentStore from "../../stores/DocumentStore";

let DocumentsModal = React.createClass({

	getInitialState : function(){
		return {
			id: this.props.documentId,
			status : null,
			status_note : null,
			type : this.props.type,
			target : this.props.target,
			result : null
		};
	},
    
    componentWillMount() {
    	var self = this,
		param = null,
		target = this.props.target,
		type = this.props.type;

		if(type=='loan') { 
			param='for_loan';
		} else if(type=='entity') {
			param='for_entity';
		} else {
			param='for_collateral';
		}
		
		$.ajax({
			    type: 'GET', 
			    url: frontendSettings.endpoints.documents + "/" + param + "/" + target,
			    dataType: 'json',

			    beforeSend: function(xhr) {
				    xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
			    },

			    success: self.onSuccess,

			    error: function(result) {
				    console.log("error:");
				    console.log(result);
				    if (result.status === 403) {
					    window.location.replace("/login.html");
				    }
			    }
                
		    });
            


    },

    onSuccess : function(result) {
    	var self = this;
    	var id = parseInt(this.props.documentId);
            this.setState({result:result});
			this.state.result.result.map(function(item,i) {
                if(item.id==id) {
			            self.setState({status : item.status, status_note : item.status_note});
                }
		    });
	},


	componentDidMount() {

		$(ReactDOM.findDOMNode(this)).modal('show');
		$(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.handleHideModal);

	},

	handleClick: function(event) {
		var self = this,
		status = {},
		status_note = {},
		value  = {};

		status = $('input[name=optradio]:checked', '#myForm').val();
		status_note = $('#comment').val();

		if(status=="Rejected") {
			value='-1';
		}else if(status=="Pending") {
			value='0';
		}else if(status=="Approved") {
			value='1';
		}
		
		if(status!==null&&status!==""&&value!==null&&value!==""&&status_note!==null&&status_note!=="") {
            
		    var formData = {
			    id : parseInt(this.state.id),
			    status: value,
			    status_note: status_note
		    };

		    $.ajax({
			    type: 'PUT', 
			    url: frontendSettings.endpoints.documents,
			    data: formData,
			    dataType: 'json',

			    beforeSend: function(xhr) {
				    xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
			    },

			    success: function(result) {
			    	
			    },

			    error: function(result) {
				    console.log("error:");
				    console.log(result);
				    if (result.status === 403) {
					    window.location.replace("/login.html");
				    }
			    }

		    });

		    this.props.handleHideModal(this.state.status);
	    }
	},

	render: function () {
		
		var status_note = this.state.status_note,
		rejected=null,
		pending = null,
		approved = null;

		$("#comment").val(this.state.status_note);

        if(this.state.status=='-1') {
            rejected='true';
            $("#item1").attr('checked', true);
		}else if(this.state.status=='0') {
			pending='true';
			$("#item2").attr('checked', true);
		}else if(this.state.status=='1') {
			approved='true';
			$("#item3").attr('checked', true);
		}

		return (

			<div id="myModal" className="modal fade" role="dialog">
			    <div className="modal-dialog">
			        <div className="modal-content">
			            <div className="modal-header">
			                
			                <h4 className="modal-title">Status</h4>

			            </div>
			            <div className="modal-body">
			                <label>Status:</label>
			                <form id = "myForm">
			                    <div className="radio">
			                        <label radio-inline><input type="radio" name="optradio" id="item1" value="Rejected" />Rejected</label>
			                    </div>
			                    <div className="radio">
			                        <label radio-inline><input type="radio" name="optradio" id="item2" value="Pending" />Pending</label>
			                    </div>
			                    <div className="radio">
			                        <label radio-inline><input type="radio" name="optradio" id="item3" value="Approved" />Approved</label>
			                    </div>
			                </form>
			                <form>
			                    <div className="form-group">
			                        <label>Description:</label>
			                        <textarea className="form-control" rows="5" id="comment"></textarea>
			                    </div>
			                </form>
			            </div>
			            <div className="modal-footer">
			                

			                {this.state.save?<span>Data Saved&nbsp;</span>:null}
			                &nbsp;
			                <button type="button" className="btn btn-success btn-sm" onClick={this.handleClick} disable={this.state.filled==true && this.state.extra==true} data-dismiss="modal">Save</button>
			                &nbsp;&nbsp;
			                <button type="button" className="btn btn-danger btn-sm" data-dismiss="modal">Close</button>

			            </div>
			        </div>
			    </div>
			</div>
		)
    },

    propTypes:{
	    handleHideModal: React.PropTypes.func.isRequired
    }

});


export default DocumentsModal;

