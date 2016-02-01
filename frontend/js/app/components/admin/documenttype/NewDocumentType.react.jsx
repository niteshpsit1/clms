/**
 * New Documment Type creation: React Class
 * */

import React from "react";
import LinkedStateMixin from "react-addons-linked-state-mixin";
import DocumentTypeStore from "../../../stores/DocumentTypeStore";
import ServerActionCreator from "../../../actions/ServerActionCreator";
import ApiUtils from "../../../utils/ApiUtils";

var NewDocumentType = React.createClass({

  mixins: [LinkedStateMixin],

  getInitialState: function () {
    return {
      loan_type: {
        code: '',
        description: '',
        payment_cycle: '',
        loan_system: '',
        data: {}
      }
    };
  },

  componentWillMount: function () {
    this.setState( {user: JSON.parse(sessionStorage.getItem('user'))} );
  },


  handleResetClick: function () {
    this.setState({
      loan_type: {
        code: '',
        description: '',
        payment_cycle: '',
        loan_system: '',
        data: {}
      }
    });
  },

  handleSaveClick: function (event) {

    if (!$('#newDocumentTypeForm')[0].checkValidity()) {
      return true;
    }

    event.preventDefault();

    var _self = this;

     var formData = {
      code: $('#newDocumentTypeForm-code').val(),
      description: $('#newDocumentTypeForm-description').val(),
      validationrequirements: $('#newDocumentTypeForm-validationrequirements').val(),
      data: {}
    };

    if (formData.code && formData.validationrequirements) {
      ServerActionCreator.newDocumentType(JSON.stringify(formData));
    }

  },


  render: function () {
    return <div className="panel-body">
      <div className="row">
        <div>
          <form className="form-horizontal" id="newDocumentTypeForm" name="newDocumentTypeForm">
            <div className="row">

              <div className="col-md-6">
              <div className="panel panel-default">
                <div className="panel-heading">New Document Type</div>
                <div className="panel-body">

                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="newDocumentTypeForm-code">Code:</label>
                  <div className="col-sm-8">
                    <input type="text" id="newDocumentTypeForm-code" className="form-control" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="newDocumentTypeForm-description">Description:</label>
                  <div className="col-sm-8">
                    <input type="text" id="newDocumentTypeForm-description" className="form-control" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="newDocumentTypeForm-validationrequirements">Validation Requirement:</label>
                  <div className="col-sm-8">
                    <input type="text" id="newDocumentTypeForm-validationrequirements" className="form-control" required />
                  </div>
                </div>

                </div>
              </div>
              </div>

            </div>

            <div className="row">
              <div className="col-md-2 col-md-offset-10">
              <span className="pull-right">
                <button type="submit" className="btn btn-lg btn-primary" onClick={this.handleSaveClick}>
                  <i className="fa fa-save"></i> Create
                </button>
              </span>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>;

  }

});


export default NewDocumentType;
