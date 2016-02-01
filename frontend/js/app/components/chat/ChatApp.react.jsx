/**
 * React components: Chat App, Main Controller.
 *
 * @author: Lautaro Gruss / lautarogruss@gmail.com
 * @created: 19/12/2015
 **/

 import React from "react";
 import UsersList from "./components/UsersList.react";
 import MessageList from "./components/MessageList.react";
 import MessageForm from "./components/MessageForm.react";
 import ChangeNameForm from "./components/ChangeNameForm.react";
 function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  }
  return s4() + s4() + s4() + s4() +
  s4() +  + s4() + s4() + s4();
}
function msgScroll() {
	var target = $('#messages');
	$('#messages').stop().animate({
		scrollTop: target.offset().top
	}, 1000);
}
var socketRoom = sessionStorage.getItem('guid');
if( !socketRoom  ){
  sessionStorage.setItem('guid', guid());
  socketRoom = sessionStorage.getItem('guid');
}

var ChatApp = React.createClass({

  getInitialState() {
    return {
     users: [],
     messages:[],
     agentId: socketRoom,
     from: '',
     to:'',
     text: '',
     user: '',
     name: '',
     onlineUsers: ''
   };
 },
 componentDidMount() {
  socket.emit('adduser', {
    'name':JSON.parse(sessionStorage.getItem('user')).name,
    'id': JSON.parse(sessionStorage.getItem('user')).id,
    guid: socketRoom,
    isAgent: true
  });
  socket.on('adduser', this._userConnected);
  socket.on('userDisconnect', this._userDisconnected);
  socket.on('init', this._initialize);
  socket.on('send:message', this._messageReceive);
  socket.on('user:join', this._userJoined);
  socket.on('update:users', this._userLeft);
  socket.on('change:name', this._userChangedName);
  socket.on('disconnect', this._disconnect);
  // clean up when a user leaves, and broadcast it to other users
  socket.emit('getOnlineUsers', {firstTime: true});
},

_userConnected(data){
  var users = this.state.onlineUsers;
  users = data;
  this.setState({onlineUsers: users});
  console.log("online Users:", this.state.onlineUsers);
},
_disconnect(){
 socket.emit('userDisconnect', {
  guid: socketRoom,
  name: name,
  onlineUsers: this.state.onlineUsers
});

},
_userDisconnected(data){
  console.log("user disconnected:", data);
  var users = this.state.onlineUsers;
  delete users[data.guid];
  this.setState({onlineUsers: users});

},

_initialize(data) {
  console.log("init:",data);
  var {users, onlineUsers} = data;
  this.setState({users, onlineUsers});
},

_messageReceive ( data ) {
  this.state.onlineUsers[data.from].hasMessages = true;
  this.setState({to: data.to, from: data.from});
  var {messages} = this.state;
  messages.push(data);
  this.setState({messages});
	msgScroll();
},

_userJoined(data) {
  var {users, messages} = this.state;
  var {name} = data;
  users.push(name);
  this.setState({users, messages});
},

_userLeft(data) {
  var {users} = data;
  this.setState({users});
},

_userChangedName(data) {
  var {oldName, newName} = data;
  var {users, messages} = this.state;
  var index = users.indexOf(oldName);
  users.splice(index, 1, newName);
  this.setState({users, messages});
},

handleMessageSubmit(message) {
  message.from = this.state.agentId;
  message.to = this.state.from;
  var {messages} = this.state;
  messages.push(message);
  /* console.dir(messages);*/
  this.setState({to:message.from , from:message.to , text: message.text});
  socket.emit('send:message', message);
  msgScroll();
},

handleMessageRender(e) {
 var userClicked = e.target.textContent;
 var userChat  = [];  var to, from, msg = {}; 
 userChat = this.state.messages.filter(function(value, index){
  return  (value.name === userClicked);
});
 console.log("Mensajes de usuario",userChat);
//remove previous conversation in panel
$("#messages .message").remove();
//Restore each client chat.
$.each( userChat, function( index, value ) {
 to = value.from; from = value.to;
 $("#messages").append(
  $("<li class='message'><strong>").text(value.name+": "+ value.text)
  );
});
msg = {to:from, from: to, text: this.state.text, name:JSON.parse(sessionStorage.getItem('user')).name}
msg.tms = new Date();
this.setState(msg);
socket.emit('send:message', msg);
},


render() {
	return (
		<div>
			<UsersList onUserClicked={this.handleMessageRender} users={this.state.onlineUsers}/>
			<div className='chat-box' >
				<MessageList messages={this.state.messages}/>
				<MessageForm onMessageSubmit={this.handleMessageSubmit} user={this.state.user}/>
			</div>
		</div>
	);
}
});

export default ChatApp;