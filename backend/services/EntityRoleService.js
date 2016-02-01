'use strict';
var debug = require('debug')('LMS:EntityRoleService');

var Boom = require('boom');
var _ = require('lodash');

var EntityRoleModel = require('../models/EntityRoleModel');

exports.validateUpdateEntityRoleParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid enitiyRole'));
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'));
  }
  return next();
};

exports.validateEntityRoleParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid enitiyRole'));
  } else if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'));
  }
  return next();
};

exports.getAllEntityRole = function (req, res, next) {
  debug('GET entity_roles service called.');
  EntityRoleModel.getAllEntity({}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.entityRoleStore = result;
    return next();
  });
};

exports.searchById = function (req, res, next) {
  debug('GET entity_roles by id service called.');
  var params = _.merge(req.params, req.body);
  if (isNaN(params.id) || _.isEmpty(params.id)) {
    return next(new Boom.notFound('Invalid id'));
  }
  EntityRoleModel.findById({id: params.id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.entityRoleStore = result;
    return next();
  });
};

exports.searchByName = function (req, res, next) {
  debug('GET entity_roles by name service called.');
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'));
  }
  EntityRoleModel.findByName({name: params.name}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (!_.isEmpty(result)) {
      req.session.entityRoleStore = result;
    }
    return next();
  });
};

exports.updateById = function (req, res, next) {
  debug('PUT entity_roles service called.');
  var params = req.body;

  var data = {
    name: params.name,
    description: params.description,
    um: req.user.id || ''
  };
  data = _.pick(params, 'name', 'description');
  var filter = {
    id: params.id
  };

  EntityRoleModel.updateById({updateData: data, filter: filter}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.entityRoleStore = result;
    return next();
  });
};

exports.deleteById = function (req, res, next) {
  debug('DELETE entity_roles service called.');

  var params = _.merge(req.params, req.body);

  if (_.isEmpty(req.session.entityRoleStore)) {
    return next(new Boom.notFound('EntityRole not found'), null);
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid entityRole'), null);
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'), null);
  }
  EntityRoleModel.deleteById({id: params.id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.entityRoleStore = {};
    return next();
  });
};

exports.newEntityRole = function (req, res, next) {
  debug('POST entity_roles service called.');
  var params = req.body;
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid entityRole'), null);
  } else if (!_.isEmpty(req.session.entityRoleStore)) {
    return next(new Boom.conflict('EntityRole already exist'));
  }

  var newEntityRole = {
    name: params.name,
    description: params.description,
    uc: req.user.id || '',
    um: req.user.id || ''
  };

  EntityRoleModel.insert({newEntityRole: newEntityRole}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.entityRoleStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid entityRole'));
  });
};
