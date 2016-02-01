/**
 * New Entity Role creation: React Class
 * */

import React from "react";
import LinkedStateMixin from "react-addons-linked-state-mixin";
import EntityStore from "../../../stores/EntityRoleStore";
import ServerActionCreator from "../../../actions/ServerActionCreator";
import ApiUtils from "../../../utils/ApiUtils";

var NewEntityRole = React.createClass({

  mixins: [LinkedStateMixin],

  getInitialState: function () {
    return {
      entity: {
        name: '',
        description: ''
      }
    };
  },

  componentWillMount: function () {
    this.setState( {user: JSON.parse(sessionStorage.getItem('user'))} );
  },


  handleResetClick: function () {
    this.setState({
      entity: {
        name: '',
        description: ''
      }
    });
  },

  handleSaveClick: function (event) {

    if (!$('#newEntityRoleForm')[0].checkValidity()) {
      return true;
    }

    event.preventDefault();

    var _self = this;

    var formData = {
      name: $('#newEntityRoleForm-name').val(),
      description: $('#newEntityRoleForm-description').val()
    };

    // Otherwise the HTML5 validation will just do the job for us
    if (formData.name && formData.description) {
      ServerActionCreator.newEntityRole(JSON.stringify(formData));
    }

  },


  render: function () {
    return <div className="panel-body">
      <div className="row">
        <div>
          <form className="form-horizontal" id="newEntityRoleForm" name="newEntityRoleForm">
            <div className="row">

              <div className="col-md-6">
              <div className="panel panel-default">
                <div className="panel-heading">New EntityRole</div>
                <div className="panel-body">

                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="newEntityRoleForm-name">Name:</label>
                  <div className="col-sm-8">
                    <input type="text" id="newEntityRoleForm-name" className="form-control" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="newEntityRoleForm-description">Description:</label>
                  <div className="col-sm-8">
                    <input type="text" id="newEntityRoleForm-description" className="form-control" />
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


export default NewEntityRole;
