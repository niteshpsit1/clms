import React from "react";
import ReactDOM from "react-dom";

import EntityStore from "../../../stores/EntityStore";
import KontoxStore from "../../../stores/KontoxStore";

var EntityPanelKontox = React.createClass({
  render: function(){
    return (
      <div className="panel-body">
        <strong className={(!this.props.currentAccount.accountInfo
                                          ? "displayblock"
                                          : "form-horizontal displaynone")}>Account info is not available.</strong>
        
            <form  className={(!this.props.currentAccount.accountInfo
                                          ? "displaynone"
                                          : "form-horizontal displayblock")} id="accountinfo">
              <div className="row">
                <div className="col-md-6">
                  <div className="panel panel-default">
                    <div className="panel-heading">Account Info</div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label className="col-sm-4 control-label">iban:</label>
                        <div className="col-sm-8">
                          <p className="form-control-static">{this.props.currentAccount.accountInfo?this.props.currentAccount.accountInfo[0].iban:''}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">Owner:</label>
                        <div className="col-sm-8">
                          <p className="form-control-static">{this.props.currentAccount.accountInfo?this.props.currentAccount.accountInfo[0].owner:''}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">Currency Name:</label>
                        <div className="col-sm-8">
                          <p className="form-control-static">{this.props.currentAccount.accountInfo?this.props.currentAccount.accountInfo[0].currencyName:''}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">Currency Balance:</label>
                        <div className="col-sm-8">
                          <p className="form-control-static">{this.props.currentAccount.accountInfo?this.props.currentAccount.accountInfo[0].currencyBalance:''}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">Active Since Atleast:</label>
                        <div className="col-sm-8">
                          <p className="form-control-static">{this.props.currentAccount.accountInfo?this.props.currentAccount.accountInfo[0].activeSinceAtLeast:''}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="panel panel-default">
                    <div className="panel-heading">Owner Info</div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label className="col-sm-4 control-label">Kind:</label>
                        <div className="col-sm-8">
                          <p className="form-control-static">{this.props.currentAccount.accountOwners?this.props.currentAccount.accountOwners[0].kind:''}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">Name:</label>
                        <div className="col-sm-8">
                          <p className="form-control-static">{this.props.currentAccount.accountOwners?this.props.currentAccount.accountOwners[0].name:''}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">Email:</label>
                        <div className="col-sm-8">
                          <p className="form-control-static">{(this.props.currentAccount.accountOwners && this.props.currentAccount.accountOwners[0].email)?this.state.currentEntity.currentAccount.accountOwners[0].email:''}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">Phone:</label>
                        <div className="col-sm-8">
                          <p className="form-control-static">{(this.props.currentAccount.accountOwners && this.props.currentAccount.accountOwners[0].phone)?this.state.currentEntity.currentAccount.accountOwners[0].phone:''}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="panel panel-default">
                    <div className="panel-heading">Transactions Info</div>

                    <table id="entities-table" className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>uid</th>
                          <th>Kind</th>
                          <th>Party</th>
                          <th>Title</th>
                          <th>Booked On</th>
                          <th>Party Iban</th>
                          <th>Transaction On</th>
                          <th>Currency Amount</th>
                          <th>Currency Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                       {this.props.currentAccount.accountTransactionsIterated.map((item, i) => {
                          return (
                            <tr key={item.uid}>
                              <td>{item.uid}</td>
                              <td>{item.kind}</td>
                              <td>{item.party}</td>
                              <td>{item.title}</td>
                              <td>{item.bookedOn}</td>
                              <td>{item.partyIban}</td>
                              <td>{item.transactionOn}</td>
                              <td>{item.currencyAmount}</td>
                              <td>{item.currencyBalance}</td>
                            </tr>
                          );
                      })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </form>

      </div>

    );
  }
});

export default EntityPanelKontox;