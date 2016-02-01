'use strict';
var debug = require('debug')('LMS:LoanDocumentService');

var Boom = require('boom');
var _ = require('lodash');

var LoanDocumentModel = require('../models/LoanDocumentModel');

exports.validateUpdateLoanDocumentParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid loanDocument'));
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  } else if (isNaN(params.document_id) || params.document_id === '') {
    return next(new Boom.notFound('Invalid documentId'));
  } else if (isNaN(params.loan_id) || params.loan_id === '') {
    return next(new Boom.notFound('Invalid loanId'));
  }
  return next();
};

exports.validateLoanDocumentParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid loanDocument'));
  } else if (isNaN(params.document_id) || params.document_id === '') {
    return next(new Boom.notFound('Invalid documentId'));
  } else if (isNaN(params.loan_id) || params.loan_id === '') {
    return next(new Boom.notFound('Invalid loanId'));
  }
  return next();
};


exports.getAllLoanDocument = function (req, res, next) {
  debug('GET loan_documents service called.');

  LoanDocumentModel.getAllLoanDocument({}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.loanDocumentStore = result;
    return next();
  });
};

exports.searchById = function (req, res, next) {
  debug('GET loan_documents by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  }
  LoanDocumentModel.findById({id: params.id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.loanDocumentStore = result;
    return next();
  });
};

exports.searchByLoanId = function (req, res, next) {
  debug('GET collateral_document by loan_id service called.');
  var params = _.merge(req.params, req.body);
  if (isNaN(params.loan_id) || params.loan_id === '') {
    return next(new Boom.notFound('Invalid loanId'));
  }
  LoanDocumentModel.findByLoanId({id: params.loan_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.loanDocumentStore = result;
    return next();
  });
};

exports.updateById = function (req, res, next) {
  debug('PUT loan_documents service called.');
  var params = _.merge(req.params, req.body);
  var data = {
    document_id: params.document_id,
    loan_id: params.loan_id,
    um: req.user.id || ''
  };
  data = _.pick(params, 'document_id', 'loan_id');
  var filter = {
    id: params.id
  };

  LoanDocumentModel.updateById({updateData: data, filter: filter}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.loanDocumentStore = result;
    return next();
  });
};

exports.deleteById = function (req, res, next) {
  debug('DELETE loan_documents service called.');

  var params = _.merge(req.params, req.body);

  if (_.isEmpty(req.session.loanDocumentStore)) {
    return next(new Boom.notFound('LoanDocument not found'), null);
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid loanDocument'), null);
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'), null);
  }
  LoanDocumentModel.deleteById({id: params.id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.loanDocumentStore = {};
    return next();
  });
};


exports.deleteByLoanId = function (req, res, next) {
  debug('DELETE loan_documents service called for given loan_id');

  var params = _.merge(req.params, req.body);

  if (_.isEmpty(req.session.loanDocumentStore)) {
    return next(new Boom.notFound('No such loanDocument associated with loanId'), null);
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid loanDocument'), null);
  } else if (isNaN(params.loan_id) || params.loan_id === '') {
    return next(new Boom.notFound('Invalid loanId'), null);
  }
  LoanDocumentModel.deleteAllLoanDocumentByLoanId({id: params.loan_id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.loanDocumentStore = {};
    return next();
  });
};

exports.newLoanDocument = function (req, res, next) {
  debug('POST loan_documents service called.');

  var params = req.body;
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid loanDocument'), null);
  }

  var newLoanDocument = {
    document_id: params.document_id,
    loan_id: params.loan_id,
    um: req.user.id || '',
    uc: req.user.id || ''
  };

  LoanDocumentModel.insert({newLoanDocument: newLoanDocument}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.loanDocumentStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid loanDocument'));
  });
};
