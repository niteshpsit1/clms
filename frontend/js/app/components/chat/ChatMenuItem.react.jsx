/**
 * React components: ChatMenuItem (left menu).
 *
 * @author: Lautaro Gruss / lautarogruss@gmail.com
 * @created: 19/12/2015
 **/

 import React from "react";
 import History from "../../utils/History";
/**
 * Left menu ChatMenuItem : React className
 * */
 var ChatMenuItem = React.createClass({


  getInitialState: function() {
    return {
      show: this.props.show || 'conversations'
    };
  },

  componentWillMount: function () {
    this.setState( {user: JSON.parse(sessionStorage.getItem('user'))} );


  },


  _onChange: function() {

  },

  _onTabChange: function() {

  },

  displayChat: function(){
   History.pushState({show: "conversations"}, "/userchat");
 },

 render: function () {

  var _self = this; 


  return (
    <li className={""}>
    <a href="#"  onClick={_self.displayChat}><i className="fa fa-folder-open"></i> <span className="nav-label">Chat</span> <span className="fa arrow"></span></a>

    </li>
    );

}

});

 export default ChatMenuItem;