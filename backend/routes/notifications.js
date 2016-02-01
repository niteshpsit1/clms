var emitter = require('../emitter');

module.exports = function (io) {

  var counter = 0;

  emitter.on('notification', function (data) {
    io.sockets.emit('notification', {id: counter, data: data});
    counter++;
  });
};
