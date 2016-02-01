'use strict';
var debug = require('debug')('LMS:CollateralService');

var Boom = require('boom');
var _ = require('lodash');

var CollateralModel = require('../models/CollateralModel');
var LoanModel = require('../models/LoanModel');
var EntityModel = require('../models/EntityModel');

exports.validateUpdateCollateralParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid collateral'), null);
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'), null);
  } else if (isNaN(params.entity_id) || params.entity_id === '') {
    return next(new Boom.notFound('Invalid entity_id'), null);
  } else if (isNaN(params.loan_id) || params.loan_id === '') {
    return next(new Boom.notFound('Invalid loan_id'), null);
  }
  return next();
};

exports.validateCollateralParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid collateral'), null);
  } else if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'), null);
  } else if (isNaN(params.entity_id) || params.entity_id === '') {
    return next(new Boom.notFound('Invalid entity_id'), null);
  } else if (isNaN(params.loan_id) || params.loan_id === '') {
    return next(new Boom.notFound('Invalid loan_id'), null);
  }
  return next();
};

exports.getAllCollateral = function (req, res, next) {
  debug('GET CollateralModel service called.');

  CollateralModel.getAllCollateral({}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.collateralStore = result;
    return next();
  });
};

exports.searchById = function (req, res, next) {
  debug('GET CollateralModel by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  }
  CollateralModel.findById({id: params.id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.collateralStore = result;
    return next();
  });
};

exports.searchLoanById = function (req, res, next) {
  debug('GET Loan by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.loan_id) || params.loan_id === '') {
    return next(new Boom.notFound('Invalid loanId'));
  }

  LoanModel.findByLoanId({loan_id: params.loan_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (_.isEmpty(result)) {
      return next(new Boom.notFound('Loan not found'));
    }
    return next();
  });
};

exports.searchEntityById = function (req, res, next) {
  debug('GET Entity by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.entity_id) || params.entity_id === '') {
    return next(new Boom.notFound('Invalid entityId'));
  }
  EntityModel.findById({id: params.entity_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (_.isEmpty(result)) {
      return next(new Boom.notFound('Entity not found'));
    }
    return next();
  });
};

exports.updateById = function (req, res, next) {
  debug('PUT CollateralModel service called.');

  var params = req.body;

  var data = {
    entity_id: params.entity_id,
    loan_id: params.loan_id,
    name: params.name,
    valuation: params.valuation,
    data: params.data,
    um: req.user.id || ''
  };
  data = _.pick(params, 'entity_id', 'loan_id', 'name', 'valuation', 'data');
  var filter = {
    id: params.id
  };

  CollateralModel.updateById({updateData: data, filter: filter}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.collateralStore = result;
    return next();
  });
};

exports.deleteById = function (req, res, next) {
  debug('DELETE CollateralModel service called.');

  var params = _.merge(req.params, req.body);

  if (_.isEmpty(req.session.collateralStore)) {
    return next(new Boom.notFound('Collateral not found'), null);
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid collateral'), null);
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'), null);
  }
  CollateralModel.deleteById({id: params.id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.collateralStore = {};
    return next();
  });
};

exports.newCollateral = function (req, res, next) {
  debug('POST CollateralModel service called.');

  var params = req.body;
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid collateral'), null);
  }

  var newCollateral = {
    entity_id: params.entity_id,
    loan_id: params.loan_id,
    name: params.name,
    valuation: params.valuation,
    data: params.data || {},
    uc: req.user.id || '',
    um: req.user.id || ''
  };

  CollateralModel.insert({newCollateral: newCollateral}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.collateralStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid collateral'));
  });
};

exports.getAllCollateralByEntityId = function (req, res, next) {
  debug('GET CollateralModel for entity_id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.entity_id) || params.entity_id === '') {
    return next(new Boom.notFound('Invalid entityId'));
  }

  CollateralModel.getAllCollateralByEntityId({id: params.entity_id}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.collateralStore = result;
    return next();
  });
};

exports.getAllCollateralByLoanId = function (req, res, next) {
  debug('GET CollateralModel for loan_id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.loan_id) || params.loan_id === '') {
    return next(new Boom.notFound('Invalid loanId'));
  }

  CollateralModel.getAllCollateralByLoanId({id: params.loan_id}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.collateralStore = result;
    return next();
  });
};


