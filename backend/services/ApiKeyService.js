'use strict';

var debug = require('debug')('LMS:ApiKeyService');

var _ = require('lodash');
var shortid = require('shortid');
var uuidBase62 = require('uuid-base62');

var ApiKeyModel = require('../models/ApiKeyModel');

exports.getApiKey = function (req, res, next) {
  debug('GET apikey service called.');
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next();
  }
  ApiKeyModel.findByKey(params, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (_.isEmpty(result)) {
      return next();
    }
    req.session.apiKeyStore = result;
    return next();
  });
};

exports.addApiKey = function (req, res, next) {
  debug('POST apikey service called.');
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next();
  }

  var apiKey = {
    id: uuidBase62.v4(), //uuid.v4();
    active: 'yes',
    userId: req.user.id ? req.user.id : 0,
    key: shortid.generate()+"-"+uuidBase62.v4()
  };

  ApiKeyModel.insert({newApiKey: apiKey}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.apiKeyStore = result;
    return next();
  });
};

