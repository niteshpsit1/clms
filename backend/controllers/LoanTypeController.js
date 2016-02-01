'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getLoanType = function (req, res, next) {
  var loanTypeStore = req.session.loanTypeStore;
  if (_.isEmpty(loanTypeStore)) {
    return next(new Boom.notFound('LoanType not found'));
  }
  req.session.result = loanTypeStore;
  return next();
};

exports.getNewLoanType = function (req, res, next) {
  var loanTypeStore = req.session.loanTypeStore;
  if (_.isEmpty(loanTypeStore)) {
    return next(new Boom.notFound('Invalid loanType'));
  }
  req.session.result = loanTypeStore;
  return next();
};

exports.getUpdatedLoanType = function (req, res, next) {
  var loanTypeStore = req.session.loanTypeStore;
  if (_.isEmpty(loanTypeStore)) {
    return next(new Boom.notFound('Failed to update loanType'));
  }
  req.session.result = loanTypeStore;
  return next();
};

exports.deleteLoanType = function (req, res, next) {
  var loanTypeStore = req.session.loanTypeStore;
  if (!_.isEmpty(loanTypeStore)) {
    return next(new Boom.notFound('Failed to delete loanType'));
  }
  req.session.result = {message: true, text: 'Delete Successful'};
  return next();
};

