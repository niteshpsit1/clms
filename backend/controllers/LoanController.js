'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getLoan = function (req, res, next) {
  var loanStore = req.session.loanStore;
  if (_.isEmpty(loanStore)) {
    return next(new Boom.notFound('Loan not found'));
  }
  req.session.result = loanStore;
  return next();
};

exports.getNewLoan = function (req, res, next) {
  var loanStore = req.session.loanStore;
  if (_.isEmpty(loanStore)) {
    return next(new Boom.notFound('Invalid loan'));
  }
  req.session.result = loanStore;
  return next();
};

exports.getUpdatedLoan = function (req, res, next) {
  var loanStore = req.session.loanStore;
  if (_.isEmpty(loanStore)) {
    return next(new Boom.notFound('Failed to update loan'));
  }
  req.session.result = loanStore;
  return next();
};

exports.deleteLoan = function (req, res, next) {
  var loanStore = req.session.loanStore;
  if (!_.isEmpty(loanStore)) {
    return next(new Boom.notFound('Failed to delete loan'));
  }
  req.session.result = {message: true, text: 'Delete Successful'};
  return next();
};

