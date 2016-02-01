/**
 * Document table: React Class
 *
 * Lists all Entities roles
 *
 * @author: Ritesh Kumar
 * @created: 11/01/2016
 **/

import React from "react";
import DocumentTypeStore from "../../../stores/DocumentTypeStore";
import ServerActionCreator from "../../../actions/ServerActionCreator";
import History from "../../../utils/History";

let LoanTypeTable = React.createClass({
  getInitialState: function() {
    return {
      documentTypeList: DocumentTypeStore.getAll(),
      show: this.props.location.query.show || 'type'
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({show: nextProps.location.query.show || 'type'});
  },

  _onChange: function() {
    this.setState({documentTypeList: DocumentTypeStore.getAll()});
  },

  componentDidMount: function() {
    DocumentTypeStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    DocumentTypeStore.removeChangeListener(this._onChange);
  },

  rowClick: function(i) {
    History.pushState(null, '/document-type/' + this.state.documentTypeList[i].id);
  },

  render: function() {
    return (
      <table id="entities-table" className="table table-striped table-hover">
        <thead>
          <tr>
            <th>CODE</th>
            <th>DESCRIPTION</th>
            <th>VALIDATIONREQUIREMENT</th>
          </tr>
        </thead>
        <tbody>
          {this.state.documentTypeList.map((item, i) => {
              return (
                <tr key={item.code + " " + item.id} onClick={this.rowClick.bind(this, i)}>
                  <td>{item.code}</td>
                  <td>{item.description}</td>
                  <td>{item.validationrequirements}</td>
                </tr>
              );
          })}
        </tbody>
      </table>
    );
  }
});

export default LoanTypeTable;
