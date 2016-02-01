'use strict';
var debug = require('debug')('LMS:DocumentTypeService');

var Boom = require('boom');
var _ = require('lodash');

var DocumentTypeModel = require('../models/DocumentTypeModel');

exports.validateUpdateDocumentTypeParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid documentType'));
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(params.code)) {
    return next(new Boom.notFound('Invalid code'));
  } else if (_.isEmpty(params.validationrequirements)) {
    return next(new Boom.notFound('Invalid validationrequirements'));
  }
  return next();
};

exports.validateDocumentTypeParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid documentType'));
  } else if (_.isEmpty(params.code)) {
    return next(new Boom.notFound('Invalid code'));
  } else if (_.isEmpty(params.validationrequirements)) {
    return next(new Boom.notFound('Invalid validationrequirements'));
  }
  return next();
};

exports.getAll = function (req, res, next) {
  debug('GET DocumentTypeModel service called.');
  DocumentTypeModel.getAllDocumentTpye({}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.documentTypeStore = result;
    return next();
  });
};

exports.searchById = function (req, res, next) {
  debug('GET DocumentTypeModel by id service called.');
  var params = _.merge(req.params, req.body);
  if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  }
  DocumentTypeModel.findById({id: params.id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.documentTypeStore = result;
    return next();
  });
};

exports.searchByCode = function (req, res, next) {
  debug('GET DocumentTypeModel by code service called.');
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params.code)) {
    return next(new Boom.notFound('Invalid code'));
  }
  DocumentTypeModel.findByCode({code: params.code}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (!_.isEmpty(result)) {
      req.session.documentTypeStore = result;
    }
    return next();
  });
};

exports.updateById = function (req, res, next) {
  debug('PUT DocumentTypeModel service called.');

  var params = req.body;

  var data = {
    code: params.code,
    description: params.description,
    validationrequirements: params.validationrequirements,
    data: params.data,
    um: req.user.id || ''
  };
  data = _.pick(params, 'code', 'description', 'validationrequirements', 'data');
  var filter = {
    id: params.id
  };

  DocumentTypeModel.updateById({updateData: data, filter: filter}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.documentTypeStore = result;
    return next();
  });
};

exports.deleteById = function (req, res, next) {
  debug('DELETE DocumentTypeModel service called.');

  var params = _.merge(req.params, req.body);

  if (_.isEmpty(req.session.documentTypeStore)) {
    return next(new Boom.notFound('DocumentType not found'));
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid documentType'));
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'), null);
  }
  DocumentTypeModel.deleteById({id: params.id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.documentTypeStore = {};
    return next();
  });
};

exports.newDocumentType = function (req, res, next) {
  debug('POST DocumentTypeModel service called.');
  var params = req.body;
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid documentType'));
  } else if (!_.isEmpty(req.session.documentTypeStore)) {
    return next(new Boom.notFound('DocumentType already exist'));
  }

  var newDocumentType = {
    code: params.code,
    description: params.description,
    validationrequirements: params.validationrequirements,
    data: params.data || {},
    uc: req.user.id || '',
    um: req.user.id || ''
  };

  DocumentTypeModel.insert({newDocumentType: newDocumentType}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.documentTypeStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid documentType'));
  });
};
