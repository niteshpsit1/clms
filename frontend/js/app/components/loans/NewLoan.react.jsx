import React from "react";
import ServerActionCreator from "../../actions/ServerActionCreator";
import LoanStore from "../../stores/LoanStore";
import EntityStore from "../../stores/EntityStore";
import ApiUtils from "../../utils/ApiUtils";
import History from "../../utils/History";

var NewLoan = React.createClass({

  componentWillMount: function () {
    this.setState( {user: JSON.parse(sessionStorage.getItem('user'))} );
  },

  getInitialState: function() {
    return {
      entitiesList: EntityStore.getAll()
    }
  },

  _onChange: function() {
      var list = EntityStore.getAll();
      if (list != null) {
        this.setState({entitiesList: EntityStore.getAll()});
      }
  },

  componentDidMount: function() {
      EntityStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
      EntityStore.removeChangeListener(this._onChange);
  },

  handleCancelClick: function (event) {
    event.preventDefault();
    History.pushState(null, "/loans?show=application");
  },

  handleSaveClick: function (event) {

    if (!$('#newLoanForm')[0].checkValidity()) {
      return true;
    }
    //Format time


    event.preventDefault();
    var _self = this;

    var formData = {
      //TODO Link it with somethin
      loan_type_id: 1,
      role_id: 1,

      entity_id: $('#newLoanForm-borrower').val(),
      principal: $('#newLoanForm-principal').val(),
      startingdate: $('#newLoanForm-startingDate').datepicker('getUTCDate').toISOString(),
      interestrate: $('#newLoanForm-interestRate').val(),
      loanterm: $('#newLoanForm-loanTerm').val(),
      data: {
        status: "application"
      }
    };

    // Otherwise the HTML5 validation will just do the job for us
    if (formData.entity_id && formData.principal && formData.startingdate && formData.interestrate && formData.loanterm) {
      formData.data = JSON.stringify(formData.data);
      ServerActionCreator.newLoan(formData);
    }

  },

  render: function () {
      return (
      <div className="panel-body">
        <form className="form-horizontal" id="newLoanForm">


          <div className="row">

              <div className="col-md-6">
              <div className="panel panel-default">
                <div className="panel-heading">New Loan</div>
                <div className="panel-body">

                  <div className="form-group">
                    <label className="col-sm-4 control-label" htmlFor="newLoanForm-borrower">Borrower:</label>
                    <div className="col-sm-8">
                      <select className="form-control" id="newLoanForm-borrower">
                        {this.state.entitiesList.map(function (entity) {
                          return <option key={"newLoanOption-"+entity.id} value={entity.id}>{entity.name}</option>;
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="col-sm-4 control-label" htmlFor="newLoanForm-principal">Amount:</label>
                    <div className="col-sm-8">
                      <input type="number" id="newLoanForm-principal" className="form-control" step="0.01"  defaultValue="0.00" required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="col-sm-4 control-label" htmlFor="newLoanForm-interestRate">Interest rate:</label>
                    <div className="col-sm-8">
                      <input type="number" id="newLoanForm-interestRate" className="form-control" step="0.01" defaultValue="0.00" required />
                    </div>
                  </div>


                  <div className="form-group">
                    <label className="col-sm-4 control-label" htmlFor="newLoanForm-startingDate">Starting date:</label>
                    <div className="col-sm-8">
                      <input data-provide="datepicker" placeholder="mm-dd-yyyy" id="newLoanForm-startingDate" className="form-control" required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="col-sm-4 control-label" htmlFor="newLoanForm-loanTerm">Loan term:</label>
                    <div className="col-sm-8">
                      <input type="number" id="newLoanForm-loanTerm" className="form-control" defaultValue="0" required />
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="row">
              <div className="col-md-12">
              <div className="pull-right">
                <button className="btn btn-default" onClick={this.handleCancelClick}><i className="fa fa-remove"></i> Cancell</button>
                <button type="submit" className="btn btn-lg btn-primary" onClick={this.handleSaveClick}>
                  <i className="fa fa-save"></i> Create
                </button>
              </div>
              </div>
            </div>

          </div>
        </form>
      </div>);
  }

});

export default NewLoan;
