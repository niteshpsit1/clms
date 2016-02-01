/**
 * Loans table: React Class
 *
 * Lists all loans
 *
 * @author: Danyil Karuna
 * @created: 16/11/2015
 **/

import React from "react";
import LoanStore from "../../stores/LoanStore";
import EntityStore from "../../stores/EntityStore";
import ServerActionCreator from "../../actions/ServerActionCreator";
import History from "../../utils/History";

let LoansTable = React.createClass({

  getInitialState: function() {
    return {
      loansList: LoanStore.getAll(),
      show: this.props.location.query.show || 'application'
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      show: nextProps.location.query.show || 'application'
    });
  },

  _onChange: function() {
    let list = LoanStore.getAll();
    if (list != null) {
      this.setState({loansList: LoanStore.getAll()});
    }
  },

  componentDidMount: function() {
    LoanStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    LoanStore.removeChangeListener(this._onChange);
  },

  rowClick: function(i) {
    History.pushState(null, '/loans/' + this.state.loansList[i].id);
  },

  render: function() {
    let list = this.state.loansList;
    return (
      <table id="loans-table" className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Principal</th>
            <th>Entity</th>
            <th>Loan Term</th>
            <th>Interest</th>
            <th>Start Date</th>
            <th>Pay Cycle</th>
            <th>Loan System</th>
          </tr>
        </thead>
        <tbody>
          {this.state.loansList.map((item, i) => {
            if(item.LoanEntity.length !== 0){
              return (
                <tr key={item.name + " " + item.id + Math.floor(Math.random() * 1000000)} onClick={this.rowClick.bind(this, i)}>
                  <td>{item.principal}</td>
                  <td>{EntityStore.getByID(item.LoanEntity[0].entity_id).name}</td>
                  <td>{item.loanterm}</td>
                  <td>{item.interestrate}</td>
                  <td>{item.startingdate}</td>
                  <td>Test</td>
                  <td>Test</td>
                </tr>
              );
             } 
          })}
        </tbody>
      </table>
    );
  }
});

export default LoansTable;
