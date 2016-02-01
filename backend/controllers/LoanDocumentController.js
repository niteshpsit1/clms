'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getLoanDocument = function (req, res, next) {
  var loanDocumentStore = req.session.loanDocumentStore;
  if (_.isEmpty(loanDocumentStore)) {
    return next(new Boom.notFound('LoanDocument not found'));
  }
  req.session.result = loanDocumentStore;
  return next();
};

exports.getNewLoanDocument = function (req, res, next) {
  var loanDocumentStore = req.session.loanDocumentStore;
  if (_.isEmpty(loanDocumentStore)) {
    return next(new Boom.notFound('Invalid LoanDocument'));
  }
  req.session.result = loanDocumentStore;
  return next();
};

exports.getUpdatedLoanDocument = function (req, res, next) {
  var loanDocumentStore = req.session.loanDocumentStore;
  if (_.isEmpty(loanDocumentStore)) {
    return next(new Boom.notFound('Failed to update loanDocument'));
  }
  req.session.result = loanDocumentStore;
  return next();
};

exports.deleteLoanDocument = function (req, res, next) {
  var loanDocumentStore = req.session.loanDocumentStore;
  if (!_.isEmpty(loanDocumentStore)) {
    return next(new Boom.notFound('Failed to delete loanDocument'));
  }
  req.session.result = {message: true, text: 'Delete Successful'};
  return next();
};

