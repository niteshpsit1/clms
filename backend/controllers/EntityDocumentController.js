'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getEntityDocument = function (req, res, next) {
  var entityDocumentStore = req.session.entityDocumentStore;
  if (_.isEmpty(entityDocumentStore)) {
    return next(new Boom.notFound('EntityDocument not found'));
  }
  req.session.result = entityDocumentStore;
  return next();
};

exports.getNewEntityDocument = function (req, res, next) {
  var entityDocumentStore = req.session.entityDocumentStore;
  if (_.isEmpty(entityDocumentStore)) {
    return next(new Boom.notFound('Invalid entityDocument'));
  }
  req.session.result = entityDocumentStore;
  return next();
};

exports.getUpdateEntityDocument = function (req, res, next) {
  var entityDocumentStore = req.session.entityDocumentStore;
  if (_.isEmpty(entityDocumentStore)) {
    return next(new Boom.notFound('Failed to update entityDocument'));
  }
  req.session.result = entityDocumentStore;
  return next();
};

exports.deleteForEntityDocument = function (req, res, next) {
  var entityDocumentStore = req.session.entityDocumentStore;
  if (!_.isEmpty(entityDocumentStore)) {
    return next(new Boom.notFound('Failed to delete entityDocument'));
  }
  req.session.result = {message: true, text: 'Delete Successful'};
  return next();
};


