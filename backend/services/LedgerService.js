'use strict';
var debug = require('debug')('LMS:LedgerService');

var Boom = require('boom');
var _ = require('lodash');

var LedgerModel = require('../models/LedgerModel');
var LoanModel = require('../models/LoanModel');
var AccountModel = require('../models/AccountModel');

exports.validateUpdateLedgerParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid ledger'));
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'));
  } else if (isNaN(params.loan_id) || params.loan_id === '') {
    return next(new Boom.notFound('Invalid loanId'));
  } else if (isNaN(params.account_id) || params.account_id === '') {
    return next(new Boom.notFound('Invalid accountId'));
  } else if (isNaN(params.amount) || params.amount === '') {
    return next(new Boom.notFound('Invalid amount'));
  } else if (isNaN(params.installment)) {
    return next(new Boom.notFound('Invalid installment'));
  } else if (isNaN(params.principal) || params.principal === '') {
    return next(new Boom.notFound('Invalid principal'));
  } else if (isNaN(params.interest || params.interest === '')) {
    return next(new Boom.notFound('Invalid interest'));
  } else if (isNaN(params.balance) || params.balance === '') {
    return next(new Boom.notFound('Invalid balance'));
  }
  return next();
};

exports.validateLedgerParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid ledger'));
  } else if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'));
  } else if (isNaN(params.loan_id) || params.loan_id === '') {
    return next(new Boom.notFound('Invalid loanId'));
  } else if (isNaN(params.account_id) || params.account_id === '') {
    return next(new Boom.notFound('Invalid accountId'));
  } else if (isNaN(params.amount) || params.amount === '') {
    return next(new Boom.notFound('Invalid amount'));
  } else if (isNaN(params.installment)) {
    return next(new Boom.notFound('Invalid installment'));
  } else if (isNaN(params.principal) || params.principal === '') {
    return next(new Boom.notFound('Invalid principal'));
  } else if (isNaN(params.interest || params.interest === '')) {
    return next(new Boom.notFound('Invalid interest'));
  } else if (isNaN(params.balance) || params.balance === '') {
    return next(new Boom.notFound('Invalid balance'));
  }
  return next();
};

exports.getAll = function (req, res, next) {
  debug('GET ledger service called.');
  LedgerModel.getAllLedger({}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.ledgerStore = {result: result};
    return next();
  });
};

exports.getAllLedgerByAccountId = function (req, res, next) {
  debug('GET ledger service by account_id called.');
  var params = _.merge(req.params, req.body);
  if (isNaN(params.account_id)) {
    return next(new Boom.notFound('Invalid accountId'), null);
  }
  LedgerModel.getAllLedgerByAccountId({account_id: params.account_id}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.ledgerStore = {result: result};
    return next();
  });
};

exports.getAllLedgerByLoanId = function (req, res, next) {
  debug('GET ledger service by loan_id called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.loan_id)) {
    return next(new Boom.notFound('Invalid loanId'), null);
  }
  LedgerModel.getAllLedgerByLoanId({loan_id: params.loan_id}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.ledgerStore = {result: result};
    return next();
  });
};

exports.searchById = function (req, res, next) {
  debug('GET ledger by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.id) || _.isEmpty(params.id)) {
    return next(new Boom.notFound('Invalid id'));
  }
  LedgerModel.findById({id: params.id}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.ledgerStore = result;
    return next();
  });
};

exports.searchByAccountId = function (req, res, next) {
  debug('GET ledger by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.account_id) || _.isEmpty(params.account_id)) {
    return next(new Boom.notFound('Invalid accountId'));
  }
  AccountModel.findById({id: params.account_id}, function (error, result) {
    if (_.isEmpty(result)) {
      return next(new Boom.notFound('Account not found'));
    }
    return next();
  });
};

exports.searchByLoanId = function (req, res, next) {
  debug('GET ledger by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.loan_id) || _.isEmpty(params.loan_id)) {
    return next(new Boom.notFound('Invalid loanId'));
  }

  LoanModel.findByLoanId({loan_id: params.loan_id}, function (error, result) {
    if (_.isEmpty(result)) {
      return next(new Boom.notFound('Loan not found'));
    }
    return next();
  });
};


exports.updateById = function (req, res, next) {
  debug('PUT ledger service called.');

  var params = req.body;
  var data = {
    name: params.name,
    loan_id: params.loan_id,
    account_id: params.account_id,
    amount: params.amount,
    projection: params.projection,
    datedue: params.datedue,
    installment: params.installment,
    principal: params.principal,
    interest: params.interest,
    balance: params.balance,
    um: req.user.id || ''
  };
  data = _.pick(params, 'name', 'loan_id', 'account_id', 'amount', 'projection', 'datedue', 'installment', 'principal', 'interest', 'balance');

  var filter = {
    id: params.id
  };

  LedgerModel.updateById({updateData: data, filter: filter}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.ledgerStore = result;
    return next();
  });
};

exports.deleteById = function (req, res, next) {
  debug('DELETE ledger service called.');

  var params = _.merge(req.params, req.body);
  if (_.isEmpty(req.session.ledgerStore)) {
    return next(new Boom.notFound('Ledger not found'), null);
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid ledger'), null);
  } else if (_.isEmpty(params.id)) {
    return next(new Boom.notFound('Invalid id'), null);
  }
  LedgerModel.deleteById({id: params.id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.ledgerStore = {};
    return next();
  });
};

exports.newLedger = function (req, res, next) {
  debug('POST ledger service called.');
  var params = req.body;


  var newLedger = {
    name: params.name,
    loan_id: params.loan_id,
    account_id: params.account_id,
    amount: params.amount,
    projection: params.projection,
    datedue: params.datedue,
    installment: params.installment,
    principal: params.principal,
    interest: params.interest,
    balance: params.balance,
    um: req.user.id || '',
    uc: req.user.id || ''
  };

  LedgerModel.insert({newLedger: newLedger}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.ledgerStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid ledger'));
  });
};
