'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getLedger = function (req, res, next) {
  var ledgerStore = req.session.ledgerStore;
  if (_.isEmpty(ledgerStore)) {
    return next(new Boom.notFound('Ledger not found'));
  }
  req.session.result = ledgerStore;
  return next();
};

exports.getNewLedger = function (req, res, next) {
  var ledgerStore = req.session.ledgerStore;
  if (_.isEmpty(ledgerStore)) {
    return next(new Boom.notFound('Invalid ledger'));
  }
  req.session.result = ledgerStore;
  return next();
};

exports.getUpdatedLedger = function (req, res, next) {
  var ledgerStore = req.session.ledgerStore;
  if (_.isEmpty(ledgerStore)) {
    return next(new Boom.notFound('Failed to update ledger'));
  }
  req.session.result = ledgerStore;
  return next();
};


exports.deleteLedger = function (req, res, next) {
  var ledgerStore = req.session.ledgerStore;
  if (!_.isEmpty(ledgerStore)) {
    return next(new Boom.notFound('Failed to delete ledger'));
  }
  req.session.result = {message: true, text: 'Delete Successful'};
  return next();
};

