'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressSession = require('express-session');

var routeV1 = require('./routes/v1/index');
var AppConfig = require('./lib/AppConfig');
var passport = require('./lib/passport');
/*var config = require('./../config/backend.config');
var db = require('./lib/db');*/
//var socketChat = require('./routes/v1/socket.js');
var app = express();
/*var server = require('http').createServer(app);*/

//CORS
app.use(function (request, response, next) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Serve "public" directory as static
app.use('/', express.static(path.join(__dirname, '/../frontend/')));
app.use('/chat', express.static(path.join(__dirname, '/../agentpanel/')));
app.use('/config/', express.static(path.join(__dirname, '/../config/')));

//Handle request
app.use(expressSession({
  secret: 'avevgretaswdef23wef23',
  saveUninitialized: false, // don't create session until something stored,
  resave: false // don't save session if unmodified
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.disable('x-powered-by');
// limit received data to 100mb
app.use(bodyParser.urlencoded({extended: false, limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));

// Authentication strategies
// App Configs
app.use(AppConfig.trimParams);

// serve socket
/*var io = require('socket.io').listen(server);
 io.sockets.on('connection', socketChat);*/

app.use('/api/v1', routeV1); //This is our route middleware
// Error handling
app.use(AppConfig.handleError);
// Handle response
app.use(AppConfig.handleSuccess);
// Handle response
app.use(AppConfig.handle404);


app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/../frontend/index.html'));
});

//Catch uncaught exceptions
process.on('uncaughtException', function (error) {
  // handle the error safely
  console.log('Inside uncaughtException');
  console.log(error);
  return error;
});

module.exports = app;