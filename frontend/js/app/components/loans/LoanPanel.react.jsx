/**
 * Selected Loan : React Class
 * */

import React from "react";
import LinkedStateMixin from "react-addons-linked-state-mixin";
import ServerActionCreator from "../../actions/ServerActionCreator";
import LoanStore from "../../stores/LoanStore";
import EntityStore from "../../stores/EntityStore";

import Documents from "../documents/Documents.react";
import DocumentsUploader from "../documents/DocumentsUploader.react";

import CollateralTable from "./collateral/CollateralTable.react";
import NewCollateral from "./collateral/NewCollateral.react";

let LoanPanel = React.createClass({

  mixins: [LinkedStateMixin],

  getStateFromStores: function() {
    var thisLoan = LoanStore.getByID(this.props.params.id);

    /*thisLoan.principalCurrency = thisLoan.principal[0];
    thisLoan.principal = parseFloat(thisLoan.principal.substring(1).replace(",", "")).toFixed(2);
    thisLoan.interestRateCurrency = thisLoan.interestrate[0];
    thisLoan.interestrate = parseFloat(thisLoan.interestrate.substring(1).replace(",", "")).toFixed(2);*/
    if (thisLoan.id !== undefined) {
      thisLoan.entity_id = thisLoan.LoanEntity[0].entity_id;
    }
    return {
      currentLoan: thisLoan,
      newLoan: jQuery.extend(true, {}, thisLoan),
      edited: false
    };
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  componentDidMount: function() {
    LoanStore.addChangeListener(this._onChange);
    $('#loanForm-startingDate').datepicker('setUTCDate', this.state.startingdate);
    $('#loanForm-startingDate').datepicker().on('changeDate', (e) => {
      var newLoan = this.state.newLoan;
      newLoan['startingdate'] = $('#loanForm-startingDate').datepicker('getUTCDate').toISOString();
      this.setState({newLoan: newLoan, edited: true});
    });
  },

  componentsWillUnmount: function() {
    LoanStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(this.getStateFromStores());
  },

  makeValueLink: function(key) {
    return {
      value: this.state.newLoan[key],
      requestChange: (newValue) => {
        var newLoan = this.state.newLoan;
        newLoan[key] = newValue;
        this.setState({newLoan: newLoan, edited: true});
      }
    }
  },

  handleSaveClick: function(event) {

    var _self = this;

    if (!$('#updateLoanForm')[0].checkValidity()) {
      return true;
    }

    event.preventDefault();

    var formData = {
      id: this.state.newLoan.id,
      entity_id: this.state.newLoan.entity_id,
      principal: $('#loanForm-principal').val(),
      startingdate: $('#loanForm-startingDate').datepicker('getUTCDate').toISOString(),
      interestrate: $('#loanForm-interestRate').val(),
      loanterm: $('#loanForm-loanTerm').val()
    };

    // Otherwise the HTML5 validation will just do the job for us
    if (formData.entity_id && formData.principal && formData.startingdate && formData.interestrate && formData.loanterm) {
      ServerActionCreator.editLoan(formData);
    }
  },

  handleCancelClick: function() {
    //this.setState({currentLoan: LoanStore.getByID(this.props.id), edited: false});
    this._onChange();
  },

  handleDeleteClick: function() {
    ServerActionCreator.deleteLoan(this.state.currentLoan.id);
  },

  render: function() {
    if (this.state.currentLoan.id !== undefined) {
      return (
        <div className="tabs-container">
          <ul className="nav nav-tabs">
            <li className="active">
              <a data-toggle="tab" href="#tab-1">Loan</a>
            </li>
            <li className="">
              <a data-toggle="tab" href="#tab-2">Documents</a>
            </li>
            <li className="">
              <a data-toggle="tab" href="#tab-3">Collateral</a>
            </li>
          </ul>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane active">
              <div className="row">
                <h3 className="btn-righticon ">
                  <i className="fa fa-check">&nbsp; Edit loan #{this.state.currentLoan.id}</i>
                </h3>
                <div className="btn-group">
                  <button data-toggle="dropdown" className="btn btn-primary  dropdown-toggle" aria-expanded="false">Funds Disbursed
                    <span className="caret"></span>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#">Processing</a>
                    </li>
                    <li>
                      <a href="#">Approval TIL Sent</a>
                    </li>
                    <li>
                      <a href="#">Final TIL Sent</a>
                    </li>
                    <li>
                      <a href="#">Declined Terms</a>
                    </li>
                    <li>
                      <a href="#">Denied</a>
                    </li>
                    <li>
                      <a href="#">Dropped</a>
                    </li>
                    <li>
                      <a href="#">Funds Disbursed</a>
                    </li>
                  </ul>
                </div>
                <form className="form-horizontal" id="updateLoanForm">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="panel panel-default">
                        <div className="panel-heading">Info</div>
                        <div className="panel-body">
                          <div className="form-group">
                            <label className="col-sm-4 control-label">ID:</label>
                            <div className="col-sm-8">
                              <p className="form-control-static">{this.state.currentLoan.id}</p>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="col-sm-4 control-label">Created at:</label>
                            <div className="col-sm-8">
                              <p className="form-control-static">{new Date(this.state.currentLoan.tsc).toLocaleDateString(frontendSettings.locale)}</p>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="col-sm-4 control-label">Last edit:</label>
                            <div className="col-sm-8">
                              <p className="form-control-static">{new Date(this.state.currentLoan.tsm).toLocaleDateString(frontendSettings.locale)}</p>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="col-sm-4 control-label">Entity:</label>
                            <div className="col-sm-8">
                              <p className="form-control-static">{EntityStore.getByID(this.state.currentLoan.entity_id).name}</p>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="col-sm-4 control-label" htmlFor="loanForm-principal">Amount:</label>
                            <div className="col-sm-8">
                              <input type="text" name="amount" className="form-control" id="loanForm-principal" valueLink={this.makeValueLink('principal')} required/>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="col-sm-4 control-label" htmlFor="loanForm-startingDate">Starting date:</label>
                            <div className="col-sm-8">
                              <input data-provide="datepicker" placeholder="mm-dd-yyyy" name="startingDate" className="form-control" id="loanForm-startingDate" valueLink={this.makeValueLink('startingdate')}/>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="col-sm-4 control-label" htmlFor="loanForm-interestRate">Interest:</label>
                            <div className="col-sm-8">
                              <input type="text" name="interestRate" className="form-control" id="loanForm-interestRate" valueLink={this.makeValueLink('interestrate')} required/>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="col-sm-4 control-label" htmlFor="loanForm-interestRate">Loan term:</label>
                            <div className="col-sm-8">
                              <input type="number" min="0" steps="1" name="loanTerm" className="form-control pull-left smallInput" id="loanForm-loanTerm" valueLink={this.makeValueLink('loanterm')} required/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="row">
                    <button type="button" className="btn btn-danger" value="Delete" onClick={this.handleDeleteClick}>Delete</button>
                    <div className="pull-right">
                      <button type="button" className={(!this.state.edited
                        ? "disabled"
                        : "") + " btn btn-default"} value="Cancel" onClick={this.state.edited
                        ? this.handleCancelClick
                        : ''}>Cancel</button>
                      <button type="button" className={(!this.state.edited
                        ? "disabled"
                        : "") + " btn btn-primary"} value="Save" onClick={this.state.edited
                        ? this.handleSaveClick
                        : ''}>Save</button>
                    </div>
                  </div>

                </form>
              </div>
            </div>
            <div id="tab-2" className="tab-pane">
              <DocumentsUploader type="loan" target={this.state.currentLoan.id}/>
              <Documents type="loan" target={this.state.currentLoan.id}/>
            </div>
            <div id="tab-3" className="tab-pane">
              <CollateralTable loanID={this.state.currentLoan.id}/>
              <NewCollateral loanID={this.state.currentLoan.id} entityID={this.state.currentLoan.entity_id}/>
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

export default LoanPanel;
