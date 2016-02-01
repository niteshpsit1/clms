'use strict';
var debug = require('debug')('LMS:Server');

var app = require('./app');
var db = require('./lib/db');
var config = require('./../config/backend.config');
var socketChat = require('./routes/v1/socket.js');
app.set('port', process.env.PORT || config.server.port);
// Connecting to and initializing our database...

db.init().then(function (error) {
  if (error) {
    process.exit(1);
  } else {
  // STARTING BACKEND SERVER...
    // ==============================================
  var server =  app.listen(app.get('port'), function () {
      var io = require('socket.io').listen(server);
      socketChat(io);
      debug('listening on port ' + this.address().port + ' in ' + config.server.appName);
      if (config.server.appName === 'cj-lms-local' || config.server.appName === 'cj-lms-dev') {
        // require('./lib/DummyData')();
      }
    });
  }
}).catch(function (error) {
  debug('PostgreSQL: unable to connect to the database: ' + error.message);
});