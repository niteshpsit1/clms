'use strict';
var debug = require('debug')('LMS:TokenService');
/**
 * Created by Patoliya on 12/31/2015.
 */

var jwt = require('jsonwebtoken');
var Boom = require('boom');
var _ = require('lodash');

var SessionModel = require('./../models/SessionModel');
var ApiKeyModel = require('./../models/ApiKeyModel');
var config = require('./../../config/backend.config');

exports.validateToken = function (req, res, next) {
  debug('Inside validate token');
  var token = req.headers['x-access-token'] || '';
  var apiKey = req.headers['x-api-key'] || '';
  //if (_.isEmpty(token) && _.isEmpty(apiKey)) {
  //  return next(new Boom.forbidden('No token provided.'), null);
  //}
  // decode token
  if (!_.isEmpty(token)) {
    // verifies secret and checks expiry
    jwt.verify(token, config.jwt.secret, function (error, decoded) {
      if (!_.isEmpty(error)) {
        return next(new Boom.forbidden('Failed to authenticate token.'), null);
      } else if (_.isEmpty(decoded)) {
        return next(null, null);
      }

      var filter = {
        uuid: decoded.uuid,
        email: decoded.email
      };

      SessionModel.getOne(filter, function (error, result) {
        if (!_.isEmpty(error)) {
          return next(error);
        } else if (_.isEmpty(result)) {
          return next(new Boom.notFound('Invalid user'));
        }
        req.user = decoded;
        return next();
      });
    });
  } else if (!_.isEmpty(apiKey)) {
    ApiKeyModel.findByKey({apiKey: apiKey}, function (error, result) {
      if (error) {
        return next(error);
      }
      req.user = result;
      return next();
    });
  } else {
    return next(new Boom.forbidden('No api-key/token provided.'), null);
  }
};