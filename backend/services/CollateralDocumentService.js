'use strict';
var debug = require('debug')('LMS:CollateralDocumentService');

var Boom = require('boom');
var _ = require('lodash');

var CollateralDocumentModel = require('../models/CollateralDocumentModel');

exports.validateUpdateCollateralDocumentParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid collateralDocument'), null);
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  } else if (isNaN(params.document_id) || params.document_id === '') {
    return next(new Boom.notFound('Invalid documentId'), null);
  } else if (isNaN(params.collateral_id) || params.collateral_id === '') {
    return next(new Boom.notFound('Invalid collateralId'), null);
  }
  return next();
};

exports.validateCollateralDocumentParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid collateralDocument'), null);
  } else if (isNaN(params.document_id) || params.document_id === '') {
    return next(new Boom.notFound('Invalid documentId'), null);
  } else if (isNaN(params.collateral_id) || params.collateral_id === '') {
    return next(new Boom.notFound('Invalid collateralId'), null);
  }
  return next();
};

exports.getAllCollateralDocument = function (req, res, next) {
  debug('GET collateral_document service called.');
  CollateralDocumentModel.getAllCollateralDocument({}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.collateralDocumentStore = result;
    return next();
  });
};

exports.searchById = function (req, res, next) {
  debug('GET collateral_document by id service called.');
  var params = _.merge(req.params, req.body);
  if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  }
  CollateralDocumentModel.findById({id: params.id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.collateralDocumentStore = result;
    return next();
  });
};

exports.searchByCollateralId = function (req, res, next) {
  debug('GET collateral_document by collateral_id service called.');
  var params = _.merge(req.params, req.body);
  if (isNaN(params.collateral_id) || params.collateral_id === '') {
    return next(new Boom.notFound('Invalid collateralId'));
  }
  CollateralDocumentModel.findByCollateralId({id: params.collateral_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.collateralDocumentStore = result;
    return next();
  });
};

exports.updateById = function (req, res, next) {
  debug('PUT collateral_document service called.');
  var params = req.body;

  var data = {
    document_id: params.document_id,
    collateral_id: params.collateral_id,
    um: req.user.id || ''
  };
  data = _.pick(params, 'document_id', 'collateral_id');

  var filter = {
    id: params.id
  };

  CollateralDocumentModel.updateById({updateData: data, filter: filter}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.collateralDocumentStore = result;
    return next();
  });
};

exports.deleteById = function (req, res, next) {
  debug('DELETE collateral_document service called.');

  var params = _.merge(req.params, req.body);

  if (_.isEmpty(req.session.collateralDocumentStore)) {
    return next(new Boom.notFound('CollateralDocument not found'), null);
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid collateralDocument'), null);
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'), null);
  }
  CollateralDocumentModel.deleteById({id: params.id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.collateralDocumentStore = {};
    return next();
  });
};

exports.deleteByCollateralId = function (req, res, next) {
  debug('DELETE collateral_document service called for given collateral_id');

  var params = _.merge(req.params, req.body);

  if (_.isEmpty(req.session.collateralDocumentStore)) {
    return next(new Boom.notFound('No such collateralDocument associated with collateralId'));
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid collateralDocument'));
  } else if (isNaN(params.collateral_id) || params.collateral_id === '') {
    return next(new Boom.notFound('Invalid collateralId'));
  }
  CollateralDocumentModel.deleteAllCollateralDocumentByCollateralId({id: params.collateral_id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.collateralDocumentStore = {};
    return next();
  });
};

exports.newCollateralDocument = function (req, res, next) {
  debug('POST collateral_document service called.');

  var params = req.body;
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid collateralDocument'));
  }

  var newCollateralDocument = {
    document_id: params.document_id,
    collateral_id: params.collateral_id,
    um: req.user.id || '',
    uc: req.user.id || ''
  };

  CollateralDocumentModel.insert({newCollateralDocument: newCollateralDocument}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.collateralDocumentStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid collateralDocument'));
  });
};
