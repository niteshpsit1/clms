'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getEntityRole = function (req, res, next) {
  var entityRoleStore = req.session.entityRoleStore;
  if (_.isEmpty(entityRoleStore)) {
    return next(new Boom.notFound('EntityRole not found'));
  }
  req.session.result = entityRoleStore;
  return next();
};

exports.getNewEntityRole = function (req, res, next) {
  var entityRoleStore = req.session.entityRoleStore;
  if (_.isEmpty(entityRoleStore)) {
    return next(new Boom.notFound('Invalid entityRole'));
  }
  req.session.result = entityRoleStore;
  return next();
};

exports.getUpdatedEntityRole = function (req, res, next) {
  var entityRoleStore = req.session.entityRoleStore;
  if (_.isEmpty(entityRoleStore)) {
    return next(new Boom.notFound('Failed to update  entityRole'));
  }
  req.session.result = entityRoleStore;
  return next();
};

exports.deleteEntityRole = function (req, res, next) {
  var entityRoleStore = req.session.entityRoleStore;
  if (!_.isEmpty(entityRoleStore)) {
    return next(new Boom.notFound('Failed to delete entityRole'));
  }
  req.session.result = {message: true, text: 'Delete Successful'};
  return next();
};

