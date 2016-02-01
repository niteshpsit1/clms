/**
 * React components: Admin (left menu).
 *
 * @author: Lautaro Gruss / lautarogruss@gmail.com
 * @created: 12/12/2015
 **/

import React from "react";
import History from "../../utils/History";

/**
 * Left menu Admin list : React className
 * */
var AdminMenuItem = React.createClass({


  getInitialState: function() {
    return {

    };
  },

  componentWillMount: function () {
    this.setState( {user: JSON.parse(sessionStorage.getItem('user'))} );


  },


  _onChange: function() {
    /*  var list = LoanStore.getAll();
      if (list != null) {
        this.setState({loansList: LoanStore.getAll()});
      }*/
  },

  _onTabChange: function() {
    this.setState({_d: ""});
  },



  displayAdminTasks: function () {
  },

  loadLoanTypes: function (event) {
    History.pushState({show: "type"}, "/loantype?show=type");
    event.preventDefault();
  },

  loadEntityRoles: function (event) {
    History.pushState({show: "role"}, "/entityrole?show=role");
    event.preventDefault();
  },

  loadDocumentTypes: function (event) {
    History.pushState({show: "role"}, "/document-type?show=type");
    event.preventDefault();
  },

  handleNewEntityRole: function (event) {
    History.pushState(null, "/entityrole/new");
    event.preventDefault();
  },

  handleNewLoanType: function (event) {
    History.pushState(null, "/loantype/new");
    event.preventDefault();
  },

  handleNewDocumentType: function (event) {
    History.pushState(null, "/document-type/new");
    event.preventDefault();
  },



  render: function () {

    var _self = this;


    return (
      <li className="">
        <a href="#"  onClick={_self.displayAdminTasks}><i className="fa fa-folder-open"></i> <span className="nav-label">Admin</span> <span className="fa arrow"></span></a>
        <ul className="nav nav-second-level">
          <li className="">
            <a href="#" onClick={_self.loadLoanTypes}>Loan Types</a>
            <ul className="">
              <li className="">
                <a href="#" onClick={_self.handleNewLoanType}>New LoanType</a>
              </li>
            </ul>
          </li>
          <li className="">
            <a href="#" onClick={_self.loadEntityRoles} >Entity Roles</a>
            <ul className="">
              <li className="">
                <a href="#" onClick={_self.handleNewEntityRole}>New EntityRole</a>
              </li>
            </ul>
          </li>
          <li className="">
            <a href="#" onClick={_self.loadDocumentTypes} >Document Types</a>
            <ul className="">
              <li className="">
                <a href="#" onClick={_self.handleNewDocumentType}>New DocumentType</a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      );

  }

});

export default AdminMenuItem;
