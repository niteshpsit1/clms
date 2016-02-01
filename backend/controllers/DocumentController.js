'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getDocument = function (req, res, next) {
  var documentStore = req.session.documentStore;
  if (_.isEmpty(documentStore)) {
    return next(new Boom.notFound('Document not found'));
  }
  req.session.result = documentStore;
  return next();
};

exports.getNewDocument = function (req, res, next) {
  var documentStore = req.session.documentStore;
  if (_.isEmpty(documentStore)) {
    return next(new Boom.notFound('Invalid Document'));
  }
  req.session.result = documentStore;
  return next();
};

exports.getUpdatedDocument = function (req, res, next) {
  var documentStore = req.session.documentStore;
  if (_.isEmpty(documentStore)) {
    return next(new Boom.notFound('Failed to update document'));
  }
  req.session.result = documentStore;
  return next();
};

exports.deleteDocument = function (req, res, next) {
  var documentStore = req.session.documentStore;
  if (!_.isEmpty(documentStore)) {
    return next(new Boom.notFound('Failed to delete document'));
  }
  req.session.result = {message: true, text: 'Delete Successful'};
  return next();
};

