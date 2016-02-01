
import React from "react";
import ReactDOM from "react-dom";

import EntityStore from "../../../stores/EntityStore";
import KontoxStore from "../../../stores/KontoxStore";

var EntityPanelEntity = React.createClass({

  render: function(){
    return (
      <div className="panel-body">
        <div className="row">
          <div>
            <h3 className="btn-righticon btn-align">
              <i className="fa fa-check i-left">&nbsp;{this.props.entityInfo.entityName}</i>
              <div className="inline">
                <form className="formbtnpost" method="post" action="https://listo.mx/api/signup/login_with_token" target="_blank">
                    <input type="hidden" name="token" value={this.props.entityInfo.currentEntity.data.customer_token} />
                    <input type="submit" className={(((this.props.entityInfo.currentEntity.data.rfc == undefined) && (this.props.entityInfo.currentEntity.data.customer_token == undefined))
                                            ? "disabled"
                                            : "") + " btn btn-default"} value={this.props.entityInfo.currentEntity.data.rfc} defaultValue="Add Listo" />
                </form>
                <button type="button" className="btn btn-warning inline" defaultValue="Add Loan" onClick={this.props.entityInfo.handleAddLoanClick}>Add Loan</button>
              </div>
            </h3>
            <form className="form-horizontal" id="updateEntityForm">
              <div className="row">
                <div className="col-md-6">
                  <div className="panel panel-default">
                    <div className="panel-heading">Info</div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label className="col-sm-4 control-label">ID Number:</label>
                        <div className="col-sm-8">
                          <p className="form-control-static">{this.props.entityInfo.currentEntity.idnumber}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">Created at:</label>
                        <div className="col-sm-8">
                          <p className="form-control-static">{new Date(this.props.entityInfo.currentEntity.tsc).toLocaleDateString(frontendSettings.locale)}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">Last edit:</label>
                        <div className="col-sm-8">
                          <p className="form-control-static">{new Date(this.props.entityInfo.currentEntity.tsm).toLocaleDateString(frontendSettings.locale)}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label" htmlFor="updateEntityForm-name">Name:</label>
                        <div className="col-sm-8">
                          <input type="text" id="updateEntityForm-name" className="form-control" valueLink={this.props.makeValueLink('name')}/>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label" htmlFor="updateEntityForm-individual">Type:</label>
                        <div className="col-sm-8">
                          <select className="form-control" id="updateEntityForm-individual" valueLink={this.props.makeValueLink('individual')}>
                            <option value="false">Company</option>
                            <option value="true">Individual</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label" htmlFor="updateEntityForm-dba">Doing business as:</label>
                        <div className="col-sm-8">
                          <input type="text" id="updateEntityForm-dba" className="form-control" valueLink={this.props.makeValueLink('dba')}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="panel panel-default">
                    <div className="panel-heading">Info</div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label className="col-sm-4 control-label" htmlFor="updateEntityForm-data-phone">Phone number:</label>
                        <div className="col-sm-8">
                          <input type="text" id="updateEntityForm-data-phone" className="form-control" valueLink={this.props.makeValueLink('data-phone')}/>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label" htmlFor="updateEntityForm-data-email">Email:</label>
                        <div className="col-sm-8">
                          <input type="text" id="updateEntityForm-data-email" className="form-control" valueLink={this.props.makeValueLink('data-email')}/>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label" htmlFor="updateEntityForm-data-website">Doing business as:</label>
                        <div className="col-sm-8">
                          <input type="text" id="updateEntityForm-data-website" className="form-control" valueLink={this.props.makeValueLink('data-website')}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <button type="button" className="btn btn-danger" defaultValue="Delete" onClick={this.props.handleDeleteClick}>Delete</button>
                <div className="pull-right">
                  <button type="button" className={(!this.props.entityInfo.edited
                    ? "disabled"
                    : "") + " btn btn-default"} defaultValue="Cancel" onClick={this.props.handleCancelClick}>Cancel</button>
                  <button type="button" className={(!this.props.entityInfo.edited
                    ? "disabled"
                    : "") + " btn btn-primary"} defaultValue="Save" onClick={this.props.handleSaveClick}>Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});


export default EntityPanelEntity;