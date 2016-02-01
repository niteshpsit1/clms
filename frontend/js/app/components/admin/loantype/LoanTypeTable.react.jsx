/**
 * Entity table: React Class
 *
 * Lists all Entities roles
 *
 * @author: Ritesh Kumar
 * @created: 11/01/2016
 **/

import React from "react";
import LoanTypeStore from "../../../stores/LoanTypeStore";
import ServerActionCreator from "../../../actions/ServerActionCreator";
import History from "../../../utils/History";

let LoanTypeTable = React.createClass({
  getInitialState: function() {
    return {
      loanTypeList: LoanTypeStore.getAll(),
      show: this.props.location.query.show || 'type'
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({show: nextProps.location.query.show || 'type'});
  },

  _onChange: function() {
    this.setState({loanTypeList: LoanTypeStore.getAll()});
  },

  componentDidMount: function() {
    LoanTypeStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    LoanTypeStore.removeChangeListener(this._onChange);
  },

  rowClick: function(i) {
    History.pushState(null, '/loantype/' + this.state.loanTypeList[i].id);
  },

  render: function() {
    return (
      <table id="entities-table" className="table table-striped table-hover">
        <thead>
          <tr>
            <th>CODE</th>
            <th>DESCRIPTION</th>
            <th>PAYMENT CYCLE</th>
            <th>LOAN SYSTEM</th>
          </tr>
        </thead>
        <tbody>
          {this.state.loanTypeList.map((item, i) => {
              return (
                <tr key={item.code + " " + item.id} onClick={this.rowClick.bind(this, i)}>
                  <td>{item.code}</td>
                  <td>{item.descrption}</td>
                  <td>{item.payment_cycle}</td>
                  <td>{item.loan_system}</td>
                </tr>
              );
          })}
        </tbody>
      </table>
    );
  }
});

export default LoanTypeTable;
