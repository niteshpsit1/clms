'use strict';
var debug = require('debug')('LMS:AppConfig');

var _ = require('lodash');
var utils = require('./utils/Utils');

exports.trimParams = function (req, res, next) {
  // Trim query and post parameters
  _.each(req.body, function (value, key) {
    if ((_.isString(value) && !_.isEmpty(value))) {
      req.body[key] = value.trim();
    }
  });

  _.each(req.query, function (value, key) {
    if ((_.isString(value) && !_.isEmpty(value))) {
      req.query[key] = value.trim();
    }
  });
  debug('req.body:', req.body);

  utils.setBaseUrl(req);
  return next();
};

exports.handleSuccess = function (req, res, next) {
  debug('Inside handleSuccess');
  if (req.session.result === undefined) {
    debug('Return from undefined req.session.result ');
    return next();
  }
  var resObject = req.session.result || [];
  req.session.destroy();

  return res.json(resObject);
};

exports.handle404 = function (req, res, next) {
  debug('Inside handle404');
  //var api = /v1/;
  //return next(new Boom.notFound('Invalid request ' + utils.url(req) + req.url));
  return next();
};

exports.handleError = function (err, req, res, next) {
  debug('Inside handleError');
  req.session.destroy();
  if (!err) {
    return next();
  }
  var errorResponse = {
    error: _.merge({
      stack: err.stack
    }, err.output && err.output.payload ? err.output.payload : err)
  };
  debug('Error stack :: ');
  debug(err.stack);
  debug('----------------------------------------------------------------------------------- ');
  return res.status(err.output && err.output.statusCode ? err.output.statusCode : 500).json(errorResponse);
};
