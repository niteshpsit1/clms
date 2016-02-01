/**
 * React components: Tasks (left menu).
 *
 * @author: Lautaro Gruss / lautarogruss@gmail.com
 * @created: 12/12/2015
 **/

import React from "react";



/**
 * Left menu Tasks list : React className
 * */
var TasksMenuItem = React.createClass({


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

  handleNewTask: function (event) {
        //TODO switch to new-tasks
  },

  displayTasks: function () {
    console.log("main tasks");
  },



  render: function () {

    var _self = this;


    return (
      <li className={""}>
        <a href="#"  onClick={_self.displayTasks}><i className="fa fa-folder-open"></i> <span className="nav-label">Tasks</span> <span className="fa arrow"></span></a>

      </li>
      );

  }

});

export default TasksMenuItem;
