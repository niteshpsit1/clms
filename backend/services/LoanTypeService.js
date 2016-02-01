'use strict';
var debug = require('debug')('LMS:LoanTypeService');

var Boom = require('boom');
var _ = require('lodash');

var LoanTypeModel = require('../models/LoanTypeModel');

exports.validateUpdateLoanTypeParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid loanType'));
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(params.code)) {
    return next(new Boom.notFound('Invalid code'));
  } else if (_.isEmpty(params.payment_cycle)) {
    return next(new Boom.notFound('Invalid payment cycle'));
  } else if (_.isEmpty(params.loan_system)) {
    return next(new Boom.notFound('Invalid loan system'));
  }
  return next();
};

exports.validateLoanTypeParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid loanType'));
  } else if (_.isEmpty(params.code)) {
    return next(new Boom.notFound('Invalid code'));
  } else if (isNaN(params.payment_cycle)) {
    return next(new Boom.notFound('Invalid payment cycle'));
  } else if (_.isEmpty(params.loan_system)) {
    return next(new Boom.notFound('Invalid loan system'));
  }
  return next();
};

exports.getAll = function (req, res, next) {
  debug('GET loan_types service called.');
  LoanTypeModel.getAllLoanTpye({}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.loanTypeStore = result;
    return next();
  });
};

exports.searchById = function (req, res, next) {
  debug('GET loan_types by id service called.');
  var params = _.merge(req.params, req.body);
  if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  }
  LoanTypeModel.findById({id: params.id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.loanTypeStore = result;
    return next();
  });
};

exports.searchByCode = function (req, res, next) {
  debug('GET loan_types by code service called.');
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params.code)) {
    return next(new Boom.notFound('Invalid code'));
  }
  LoanTypeModel.findByCode({code: params.code}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (!_.isEmpty(result)) {
      req.session.loanTypeStore = result;
    }
    return next();
  });
};

exports.updateById = function (req, res, next) {
  debug('PUT loan_types service called.');
  var params = req.body;

  var data = {
    code: params.code,
    description: params.description,
    payment_cycle: params.payment_cycle,
    loan_system: params.loan_system,
    data: params.data,
    um: req.user.id || ''
  };
  data = _.pick(params, 'code', 'description', 'payment_cycle', 'loan_system', 'data');
  var filter = {
    id: params.id
  };

  LoanTypeModel.updateById({updateData: data, filter: filter}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.loanTypeStore = result;
    return next();
  });
};

exports.deleteById = function (req, res, next) {
  debug('DELETE loan_types service called.');
  var params = _.merge(req.params, req.body);

  if (_.isEmpty(req.session.loanTypeStore)) {
    return next(new Boom.notFound('LoanType not found'), null);
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid loanType'), null);
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'), null);
  }
  LoanTypeModel.deleteById({id: params.id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.loanTypeStore = {};
    return next();
  });
};

exports.newLoanType = function (req, res, next) {
  debug('POST loan_types service called.');
  var params = req.body;
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid loanType'), null);
  } else if (!_.isEmpty(req.session.loanTypeStore)) {
    return next(new Boom.conflict('LoanType already exist'));
  }

  var newLoanType = {
    code: params.code,
    description: params.description,
    payment_cycle: params.payment_cycle,
    loan_system: params.loan_system,
    data: params.data || {},
    uc: req.user.id || '',
    um: req.user.id || ''
  };

  LoanTypeModel.insert({newLoanType: newLoanType}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.loanTypeStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid loanType'));
  });
};
