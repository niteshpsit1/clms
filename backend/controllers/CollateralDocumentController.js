'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getCollateralDocument = function (req, res, next) {
  var collateralDocumentStore = req.session.collateralDocumentStore;
  if (_.isEmpty(collateralDocumentStore)) {
    return next(new Boom.notFound('CollateralDocument not found'));
  }
  req.session.result = collateralDocumentStore;
  return next();
};

exports.getNewCollateralDocument = function (req, res, next) {
  var collateralDocumentStore = req.session.collateralDocumentStore;
  if (_.isEmpty(collateralDocumentStore)) {
    return next(new Boom.notFound('Invalid collateralDocument'));
  }
  req.session.result = collateralDocumentStore;
  return next();
};

exports.getUpdatedCollateralDocument = function (req, res, next) {
  var collateralDocumentStore = req.session.collateralDocumentStore;
  if (_.isEmpty(collateralDocumentStore)) {
    return next(new Boom.notFound('Failed to update collateralDocument'));
  }
  req.session.result = collateralDocumentStore;
  return next();
};

exports.deleteCollateralDocument = function (req, res, next) {
  var collateralDocumentStore = req.session.collateralDocumentStore;
  if (!_.isEmpty(collateralDocumentStore)) {
    return next(new Boom.notFound('Failed to delete collateralDocument'));
  }
  req.session.result = {message: true, text: 'Delete Successful'};
  return next();
};

