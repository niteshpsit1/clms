/**
 * React components: ActivityHistory (left menu).
 *
 * @author: Lautaro Gruss / lautarogruss@gmail.com
 * @created: 12/12/2015
 **/

import React from "react";

/**
 * Left menu ActivityHistory list : React className
 * */
var ActivityHistoryMenuItem = React.createClass({


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



  displayTasks: function () {
    console.log("Activity history");
  },



  render: function () {

    var _self = this;


    return (
      <li className="">
        <a href="#"  onClick={_self.displayTasks}><i className="fa fa-folder-open"></i> <span className="nav-label">Activity History</span> <span className="fa arrow"></span></a>

      </li>
      );

  }

});

export default ActivityHistoryMenuItem;
