import React from 'react';

var Notifications = React.createClass({

  getInitialState: function() {
    return {notifications: [], newNotifications: [], counter: 0};
  },

  componentWillMount: function() {
    socket.on('notification', (data) => {
      this.setState({
        newNotifications: this.state.newNotifications.concat([data])
      })
      setTimeout(() => {
        var _newNotifications = this.state.newNotifications.pop();
        var _notifications = this.state.notifications;
        _notifications.push(_newNotifications);

        this.setState({notifications: _notifications, newNotifications: this.state.newNotifications});
      }, 5000);
    });


  },

  componentWillUnmount: function() {
    socket.off('notification');
    clearInterval(this.state.interval);
  },

  render: function() {
    return <div className="notification-container">{this.state.newNotifications.map(function(notification) {
        return <div className="notification alert alert-success" key={notification.id}>
          <b className="notification-header">{notification.data.title}</b>
          <p className="notification-body">{notification.data.message}</p>
        </div>
      })}</div>
  }
});

export default Notifications;
