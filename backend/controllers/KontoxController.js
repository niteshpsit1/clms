'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getKontox = function (req, res, next) {
  var kontoxStore = req.session.kontoxStore;
  if (_.isEmpty(kontoxStore)) {
    return next(new Boom.notFound('Collateral not found'));
  }
  req.session.result = kontoxStore;
  return next();
};

exports.getNewKontox = function (req, res, next) {
  var kontoxStore = req.session.kontoxStore;
  if (_.isEmpty(kontoxStore)) {
    return next(new Boom.notFound('Invalid kontox'));
  }
  req.session.result = kontoxStore;
  return next();
};

exports.getUpdatedKontox = function (req, res, next) {
  var kontoxStore = req.session.kontoxStore;
  if (_.isEmpty(kontoxStore)) {
    return next(new Boom.notFound('Failed to update kontox'));
  }
  req.session.result = kontoxStore;
  return next();
};

exports.deleteKontox = function (req, res, next) {
  var kontoxStore = req.session.kontoxStore;
  if (!_.isEmpty(kontoxStore)) {
    return next(new Boom.notFound('Failed to delete kontox'));
  }
  req.session.result = {message: true, text: 'Delete Successful'};
  return next();
};

