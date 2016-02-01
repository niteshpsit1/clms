'use strict';
var debug = require('debug')('LMS:EntityDocumentService');

var Boom = require('boom');
var _ = require('lodash');

var EntityDocumentModel = require('../models/EntityDocumentModel');

exports.validateUpdateEntityDocumentParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid enitiyDocument'));
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  } else if (isNaN(params.entity_id) || params.entity_id === '') {
    return next(new Boom.notFound('Invalid entityId'));
  } else if (isNaN(params.document_id) || params.document_id === '') {
    return next(new Boom.notFound('Invalid documentId'));
  }
  return next();
};

exports.validateEntityDocumentParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid enitiyDocument'));
  } else if (isNaN(params.entity_id) || params.entity_id === '') {
    return next(new Boom.notFound('Invalid entityId'));
  } else if (isNaN(params.document_id) || params.document_id === '') {
    return next(new Boom.notFound('Invalid documentId'));
  }
  return next();
};


exports.getAllEntityDocument = function (req, res, next) {
  debug('GET entity_document service called.');
  EntityDocumentModel.getAllEntityDocument({}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.entityDocumentStore = result;
    return next();
  });
};

exports.searchById = function (req, res, next) {
  debug('GET entity_document by id service called.');
  var params = _.merge(req.params, req.body);
  if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  }
  EntityDocumentModel.findById({id: params.id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.entityDocumentStore = result;
    return next();
  });
};

exports.searchByEntityId = function (req, res, next) {
  debug('GET entity_document by entity_id service called.');
  var params = _.merge(req.params, req.body);
  if (isNaN(params.entityId) || params.entityId === '') {
    return next(new Boom.notFound('Invalid entityId'));
  }
  EntityDocumentModel.findByEntityId({id: params.entityId}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.entityDocumentStore = result;
    return next();
  });
};

exports.updateById = function (req, res, next) {
  debug('PUT entity_document service called.');
  var params = req.body;

  var data = {
    document_id: params.document_id,
    entity_id: params.entity_id,
    um: req.user.id || ''
  };
  data = _.pick(params, 'document_id', 'entity_id');
  var filter = {
    id: params.id
  };

  EntityDocumentModel.updateById({updateData: data, filter: filter}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.entityDocumentStore = result;
    return next();
  });
};

exports.deleteById = function (req, res, next) {
  debug('DELETE entity_document service called.');
  var params = _.merge(req.params, req.body);

  if (_.isEmpty(req.session.entityDocumentStore)) {
    return next(new Boom.notFound('EntityDocument not found'));
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid entityDocument'));
  } else if (isNaN(params.id)) {
    return next(new Boom.notFound('Invalid id'));
  }
  EntityDocumentModel.deleteById({id: params.id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.entityDocumentStore = {};
    return next();
  });
};

exports.deleteByEntityId = function (req, res, next) {
  debug('DELETE entity_document service called for given entity_id');

  var params = _.merge(req.params, req.body);

  if (_.isEmpty(req.session.entityDocumentStore)) {
    return next(new Boom.notFound('EntityDocument not found'));
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid entityDocument'));
  } else if (isNaN(params.entityId)) {
    return next(new Boom.notFound('Invalid id'));
  }
  EntityDocumentModel.deleteAllEntityDocumentByEntityId({id: params.entityId}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.entityDocumentStore = {};
    return next();
  });
};

exports.newEntityDocument = function (req, res, next) {
  debug('POST entity_document service called.');
  var params = req.body;
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid entityDocument'));
  } else if (isNaN(params.document_id) || params.document_id === '') {
    return next(new Boom.notFound('Invalid documentId'));
  } else if (isNaN(params.entity_id) || params.entity_id === '') {
    return next(new Boom.notFound('Invalid entityId'));
  }

  var newEntityDocument = {
    document_id: params.document_id,
    entity_id: params.entity_id,
    uc: req.user.id || '',
    um: req.user.id || ''
  };

  EntityDocumentModel.insert({newEntityDocument: newEntityDocument}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.entityDocumentStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid entityDocument'));
  });
};