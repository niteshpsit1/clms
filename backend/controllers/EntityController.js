'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getEntity = function (req, res, next) {
  var entityProfileStore = req.session.entityProfileStore;
  if (_.isEmpty(entityProfileStore)) {
    return next(new Boom.notFound('Entity not found'));
  }
  req.session.result = entityProfileStore;
  return next();
};

exports.getNewEntity = function (req, res, next) {
  var entityProfileStore = req.session.entityProfileStore;
  if (_.isEmpty(entityProfileStore)) {
    return next(new Boom.notFound('Invalid entity'));
  }
  req.session.result = entityProfileStore;
  return next();
};

exports.getUpdatedEntity = function (req, res, next) {
  var entityProfileStore = req.session.entityProfileStore;
  if (_.isEmpty(entityProfileStore)) {
    return next(new Boom.notFound('Failed to update entity'));
  }
  req.session.result = entityProfileStore;
  return next();
};

exports.deleteEntity = function (req, res, next) {
  var entityProfileStore = req.session.entityProfileStore;
  if (!_.isEmpty(entityProfileStore)) {
    return next(new Boom.notFound('Failed to delete entity'));
  }
  req.session.result = {message: true, text: 'Delete Successful'};
  return next();
};

exports.loginEntity = function (req, res, next) {
  var entityProfileStore = req.session.entityProfileStore;
  if (_.isEmpty(entityProfileStore)) {
    return next(new Boom.notFound('Invalid login detail'));
  }
  req.session.result = entityProfileStore;
  return next();
};

exports.logoutEntity = function (req, res, next) {
  var entityProfileStore = req.session.entityProfileStore;
  if (!_.isEmpty(entityProfileStore)) {
    return next(new Boom.notFound('Logout failed'));
  }
  req.session.result = {error: false};
  return next();
};

