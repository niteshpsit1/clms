'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getDocumentType = function (req, res, next) {
  var documentTypeStore = req.session.documentTypeStore;
  if (_.isEmpty(documentTypeStore)) {
    return next(new Boom.notFound('DocumentType not found'));
  }
  req.session.result = documentTypeStore;
  return next();
};

exports.getNewDocumentType = function (req, res, next) {
  var documentTypeStore = req.session.documentTypeStore;
  if (_.isEmpty(documentTypeStore)) {
    return next(new Boom.notFound('Invalid documentType'));
  }
  req.session.result = documentTypeStore;
  return next();
};

exports.getUpdatedDocumentType = function (req, res, next) {
  var documentTypeStore = req.session.documentTypeStore;
  if (_.isEmpty(documentTypeStore)) {
    return next(new Boom.notFound('Failed to update documentType'));
  }
  req.session.result = documentTypeStore;
  return next();
};

exports.deleteDocumentType = function (req, res, next) {
  var documentTypeStore = req.session.documentTypeStore;
  if (!_.isEmpty(documentTypeStore)) {
    return next(new Boom.notFound('Failed to delete documentType'));
  }
  req.session.result = {message: true, text: 'Delete Successful'};
  return next();
};

