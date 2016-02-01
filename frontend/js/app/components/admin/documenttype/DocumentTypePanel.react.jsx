import React from "react";
import LinkedStateMixin from "react-addons-linked-state-mixin";
import ServerActionCreator from "../../../actions/ServerActionCreator";

import DocumentTypeStore from "../../../stores/DocumentTypeStore";
import DocumentStore from "../../../stores/DocumentStore";

import ApiUtils from "../../../utils/ApiUtils";
import History from "../../../utils/History";

import Documents from "../../documents/Documents.react";
import DocumentsUploader from "../../documents/DocumentsUploader.react";

var DocumentTypePanel = React.createClass({

  mixins: [LinkedStateMixin],

  getStateFromStores() {
    var ce = DocumentTypeStore.getByID(this.props.params.id);
    return {
      currentEntity: ce,
      newEntity: jQuery.extend(true, {}, ce),
      edited: false,
      entityName: (ce != null
        ? ce.name
        : ''),
      loading: false
    };
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  componentDidMount: function() {
    DocumentTypeStore.addChangeListener(this._onChange);
  },

  componentsWillUnmount: function() {
    DocumentTypeStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(this.getStateFromStores());
  },

  handleDeleteClick: function() {

    ServerActionCreator.deleteDocumentType(this.state.currentEntity.id);

  },

  handleCancelClick: function() {
    if (!this.state.edited) {
      return false;
    }
    this.setState({
      currentEntity: DocumentTypeStore.getByID(this.props.id),
      edited: false
    });
    this._onChange();
  },

  handleSaveClick: function() {;
    if (!this.state.edited) {
      return false;
    }

    var formData = {
      id: this.state.currentEntity.id,
      code: $('#updateDocumentTypeForm-code').val(),
      descrption: $('#updateDocumentTypeForm-descrption').val(),
      validationrequirements: $('#updateDocumentTypeForm-validationrequirements').val()
    };

    if (formData.code) {
      ServerActionCreator.editDocumentType(JSON.stringify(formData));
    }

  },

  makeValueLink: function(key) {
    var _self = this;
    return {

      value: (key.indexOf("data") > -1
        ? this.state.newEntity.data[key.split("-")[1]]
        : this.state.newEntity[key]),

      requestChange: function(newValue) {
        var newEntity = _self.state.newEntity;
        if (key.indexOf("data") > -1) {
          newEntity.data[key.split("-")[1]] = newValue;
        } else {
          newEntity[key] = newValue;
        }
        _self.setState({newEntity: newEntity, edited: true});
      }
    }
  },

  render: function() {
    if (this.state.currentEntity.id !== undefined) {
      return (
      	<div className="panel-body">
	      <div className="row">
	        <div>
	          <form className="form-horizontal" id="updateDocumentTypeForm" name="updateDocumentTypeForm">
	            <div className="row">

	              <div className="col-md-6">
	              <div className="panel panel-default">
	                <div className="panel-heading">New EntityRole</div>
	                <div className="panel-body">

	                <div className="form-group">
	                  <label className="col-sm-4 control-label" htmlFor="updateDocumentTypeForm-code">Code:</label>
	                  <div className="col-sm-8">
	                    <input type="text" id="updateDocumentTypeForm-code" className="form-control" valueLink={this.makeValueLink('code')} required />
	                  </div>
	                </div>

	                <div className="form-group">
	                  <label className="col-sm-4 control-label" htmlFor="updateDocumentTypeForm-descrption">Description:</label>
	                  <div className="col-sm-8">
	                    <input type="text" id="updateDocumentTypeForm-descrption" className="form-control" valueLink={this.makeValueLink('descrption')} />
	                  </div>
	                </div>

	                <div className="form-group">
	                  <label className="col-sm-4 control-label" htmlFor="updateDocumentTypeForm-validationrequirements">Validation Requirement:</label>
	                  <div className="col-sm-8">
	                    <input type="text" id="updateDocumentTypeForm-validationrequirements" className="form-control" valueLink={this.makeValueLink('validationrequirements')} />
	                  </div>
	                </div>
	                </div>
	              </div>
	              </div>

	            </div>

	            <div className="row">
	                <button type="button" className="btn btn-danger" defaultValue="Delete" onClick={this.handleDeleteClick}>Delete</button>
	                <div className="pull-right">
	                  <button type="button" className={(!this.state.edited
	                    ? "disabled"
	                    : "") + " btn btn-default"} defaultValue="Cancel" onClick={this.handleCancelClick}>Cancel</button>
	                  <button type="button" className={(!this.state.edited
	                    ? "disabled"
	                    : "") + " btn btn-primary"} defaultValue="Save" onClick={this.handleSaveClick}>Save</button>
	                </div>
	              </div>
	          </form>
	        </div>

	      </div>
	    </div>
      );

    } else {
      return (
        <div></div>
      );
    }

  }

});

export default DocumentTypePanel;
