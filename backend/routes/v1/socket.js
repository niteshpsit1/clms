'use strict';
var Message = require('../../models/MessageModel.js');
var redis = require("redis");
var  bluebird = require("bluebird");    
//Promisify Redis to use within promises.
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var redisClient = redis.createClient();

function emitAgentConnect(agents, guid){
  if(agents.length > 0) {
    var agent = agents[Math.floor(Math.random() * agents.length)];
    socket.broadcast.to(usernames[guid].socketId).emit('agent:logged', agent);
  }
}

// export function for listening to the socket
module.exports = function (io) {


  var users = [];
  // usernames which are currently connected to the chat
  var usernames = {};
  var agents = [];
  var guestCount = 0;

  // serve socket
  io.sockets.on('connection', function(socket){

   //First things, first, get all online users

   socket.on('getOnlineUsers', function(data){

     if(data.firstTime) {
       redisClient.getAsync('onlineUsers').then(function(result) {
        var result = JSON.parse(result) || {};
        console.log("FIRST TIMEONLINE USRS:", result);
         //Emit to all Agents
         io.emit('adduser', result );


     });

     }

   });
   socket.on('adduser', function(data){
    // store the username in the socket session for this client
    if( data.name === '') {
      var username = "Invitado";
      ++guestCount;
      username += guestCount; 
      data.name = username;
      users.push(data.name)
    }
    
    data.socketId = socket.id;
    
    if(data.isAgent){
     /* console.log("agent loggued:",data);*/
     data.isOnline = true;
     socket.broadcast.emit('agent:loggued', data);      
     agents.push(data);
   } else {

     if(agents.length > 0) {

      var agent = agents[Math.floor(Math.random() * agents.length)];
      agent.isOnline = true;
      socket.emit('agent:loggued', agent);

    }

  }
  
  usernames[data.guid] = data; 
  var onlineUsers = JSON.stringify(usernames);
  redisClient.set("onlineUsers", onlineUsers);
  
  redisClient.getAsync('onlineUsers').then(function(result) {
    var result = JSON.parse(result) || {};
    console.log("ONLINE USRS:", result);
       //Aqui trakeamos todos los usuarios que estan online
       socket.broadcast.emit('adduser', result );


     });

  socket.emit('updatechat', username , data.guid);

});




  // Notify agents that a new client has joined
 /* socket.broadcast.emit('user:join', {
    name: name
  });*/



  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
   console.log("from client", data);    
   console.log("agents: ", agents.length);

   if(data.isClient) {
    for (var i = 0;  i < agents.length; i ++) {
     socket.broadcast.to(agents[i].socketId).emit('send:message', data);
   };
 } else {
   if (data.to in usernames){

     socket.broadcast.to(usernames[data.to].socketId).emit('send:message', data);

       // Insert a new record into the DB.
       Message.insert(data.text, parseInt(data.from) , parseInt(data.to) , function( result ){
        if(result == true){
          console.log("An Message saved Successfully.");
        }else{
          console.log("An Message not saved Unfortunately.");
        }

      }); 
     }
   }
 });  

  // validate a user's name change, and broadcast it on success
  socket.on('change:name', function (data, fn) {
    if (userNames.claim(data.name)) {
      var oldName = name;
      userNames.free(oldName);

      name = data.name;
      
      socket.broadcast.emit('change:name', {
        oldName: oldName,
        newName: name
      });

      fn(true);
    } else {
      fn(false);
    }
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('userDisconnect', function (data) {
    var updateOnlineUsers = '';
   console.log("USER DISCONNECT:", data);
   socket.broadcast.emit('userDisconnect', data);
   if(data.guid in usernames){
    delete usernames[data.guid];
  }
  updateOnlineUsers = JSON.stringify(usernames);
    redisClient.set("onlineUsers", updateOnlineUsers);
    redisClient.getAsync('onlineUsers').then(function(result) {
      var result = JSON.parse(result) || {};
      console.log("NEW ONLINE USRS UPDATED:", result);
       //Aqui trakeamos todos los usuarios que estan online
       socket.broadcast.emit('adduser', result );


     });
  var idx = agents.indexOf(data.guid);
  if(idx > -1) {
   agents.splice(idx, 1);
   for( var prop in data.onlineUsers) {
    if(data.onlineUsers.hasOwnProperty(prop)){
      emitAgentConnect(agents, prop);
    }
  }

}


});


});

};