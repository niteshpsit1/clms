'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getCollateral = function (req, res, next) {
  var collateralStore = req.session.collateralStore;
  if (_.isEmpty(collateralStore)) {
    return next(new Boom.notFound('Collateral not found'));
  }
  req.session.result = collateralStore;
  return next();
};

exports.getNewCollateral = function (req, res, next) {
  var collateralStore = req.session.collateralStore;
  if (_.isEmpty(collateralStore)) {
    return next(new Boom.notFound('Invalid collateral'));
  }
  req.session.result = collateralStore;
  return next();
};

exports.getUpdatedCollateral = function (req, res, next) {
  var collateralStore = req.session.collateralStore;
  if (_.isEmpty(collateralStore)) {
    return next(new Boom.notFound('Failed to update collateral'));
  }
  req.session.result = collateralStore;
  return next();
};

exports.deleteCollateral = function (req, res, next) {
  var collateralStore = req.session.collateralStore;
  if (!_.isEmpty(collateralStore)) {
    return next(new Boom.notFound('Failed to delete collateral'));
  }
  req.session.result = {message: true, text: 'Delete Successful'};
  return next();
};

