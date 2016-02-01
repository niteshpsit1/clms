'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getMessage = function (req, res, next) {
  var messageStore = req.session.messageStore;
  if (_.isEmpty(messageStore)) {
    return next(new Boom.notFound('Message not found'));
  }
  req.session.result = messageStore;
  return next();
};


