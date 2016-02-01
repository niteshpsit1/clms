/**
 * React component: Logout button - (it's a simple logout button!)
 *
 * It will trigger a session.destroy() in both HTML5 sessionStorage and server side session API.
 *
 * @author: Daniele Gazzelloni / daniele@danielegazzelloni.com
 * @created: 22/10/2015
 **/



import React from "react";

var LogoutButton = React.createClass({

  componentWillMount: function () {
    this.setState( {user: JSON.parse(sessionStorage.getItem('user'))} );
  },

  handleLogoutClick: function () {
    var _self = this;

    if (_self.state.user) {
      $.ajax({
        type: 'GET',
        url: frontendSettings.endpoints.logout,
        //data: _self.state.user,
        dataType: 'json',

        beforeSend: function (xhr) {
          xhr.setRequestHeader('x-access-token', _self.state.user.token);
        },

        success: function (result) {
          console.log('result:',result);
          if (result.message === true) {
            socket.emit('userDisconnect', {
             guid: sessionStorage.getItem('guid'),
             name: JSON.parse(sessionStorage.getItem('user')).name
           });
            // Destroy user record stored in local HTML5 session
            sessionStorage.setItem('user', null);
            _self.setState( {user: null} );
            window.location.replace("login.html");
          }
        }
      });
    }
  },

  render: function () {
    return <a href="#" onClick={this.handleLogoutClick} >
      <i className="fa fa-sign-out"></i> Log out
    </a>;
  }

});


export default LogoutButton;