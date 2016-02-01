'use strict';
var debug = require('debug')('LMS:MessageService');

var PROCESS_ENV = process.env;
var Boom = require('boom');
var _ = require('lodash');

var MessageModel = require('../models/MessageModel');

exports.searchById = function (req, res, next) {
  debug('GET message by id (query) service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  }
  MessageModel.findById({id: params.id}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.messageStore = result;
    return next();
  });
};


exports.sendMail = function (req, res, next) {
  debug('GET mail service called.');
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid data'));
  } else if (_.isEmpty(params.email)) {
    return next(new Boom.notFound('Invalid email'));
  } else if (_.isEmpty(params.username)) {
    return next(new Boom.notFound('Invalid username'));
  }

  var mailOptions = {
    from: PROCESS_ENV.LMS_EMAIL_CONFIG_EMAIL,
    subject: 'LMS',
    to: params.email,
    text: 'Hi, Agent.\n you just received an message from ' + params.username
  };

  MessageModel.sendMail({mailOptions: mailOptions}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    req.session.result = {message: result};
    return next();
  });
};

