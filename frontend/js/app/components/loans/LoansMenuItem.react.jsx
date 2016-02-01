/**
 * React components: Entities list (left menu).
 *
 * @author: Daniele Gazzelloni / daniele@danielegazzelloni.com
 * @created: 21/10/2015
 **/

import React from "react";
import ApiUtils from "../../utils/ApiUtils";
import History from "../../utils/History";

/**
 * Left menu Entities list : React className
 * */
var LoansMenuItem = React.createClass({

  componentWillMount: function() {
    this.setState({
      user: JSON.parse(sessionStorage.getItem('user'))
    });
  },

  _onTabChange: function() {
    this.setState({_d: ""});
  },

  handleNewLoan: function(event) {
    History.pushState(null, "/loans/new");
  },

  loadApplicationList: function(event) {
    History.pushState(null, "/loans?show=application");
  },

  loadProcessedList: function(event) {
    History.pushState(null, "/loans?show=processed");
  },

  loadActiveList: function(event) {
    History.pushState(null, "/loans?show=active");
  },

  loadLateList: function(event) {
    History.pushState(null, "/loans?show=late");
  },

  render: function() {

    var _self = this;

    return (
      <li className={""}>
        <a href="#" onClick={_self.loadApplicationList}>
          <i className="fa fa-folder-open"></i>
          <span className="nav-label">Loans</span>
          <span className="fa arrow"></span>
        </a>
        <ul className="nav nav-second-level" id="loansList">

          <li className={""} key="application-list">
            <a href="#" onClick={_self.loadApplicationList} id="entityLi-application-list">Applications</a>
          </li>
          <li className={""} key="processed-list">
            <a href="#" onClick={_self.loadProcessedList} id="entityLi-processed-list">Processed</a>
          </li>
          <li className={""} key="active-list">
            <a href="#" onClick={_self.loadActiveList} id="loans-active">Active</a>
          </li>
          <li className={""} key="late-list">
            <a href="#" onClick={_self.loadLateList} id="loans-late">Late</a>
          </li>

          <li className="" key="new-loan-item">
            <a href="#" onClick={_self.handleNewLoan} id={"loanLi-new"}>&lt;New Loan&gt;</a>
          </li>

        </ul>
      </li>
    );

  }

});

export default LoansMenuItem;
