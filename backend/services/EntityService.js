'use strict';
var debug = require('debug')('LMS:EntityService');

var tipe = require('tipe');
var shortid = require('shortid');
var passport = require('passport');
var Boom = require('boom');
var _ = require('lodash');
var bcrypt = require('bcrypt-nodejs');

var EntityModel = require('../models/EntityModel');
var SessionModel = require('./../models/SessionModel');

exports.validateUpdateEntityParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid entity'));
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(params.idnumber)) {
    return next(new Boom.notFound('Invalid idnumber'));
  } else if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'));
  } else if (_.isEmpty(params.dba)) {
    return next(new Boom.notFound('Invalid dba'));
  } else if (_.isEmpty(params.individual)) {
    return next(new Boom.notFound('Invalid individual'));
  }
  return next();
};

exports.validateEntityParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid entity'));
  } else if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'));
  } else if (_.isEmpty(params.dba)) {
    return next(new Boom.notFound('Invalid dba'));
  } else if (_.isEmpty(params.individual)) {
    return next(new Boom.notFound('Invalid individual'));
  }
  return next();
};

exports.validateLoginParams = function (req, res, next) {
  var params = req.body;
  if (_.isEmpty(params.email)) {
    return next(new Boom.notFound('Invalid email'));
  } else if (_.isEmpty(params.password)) {
    return next(new Boom.notFound('Invalid password'));
  }
  return next();
};

exports.getAllEntity = function (req, res, next) {
  debug('GET entity service called.');
  EntityModel.getAllEntity({}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.entityProfileStore = {result: result};
    return next();
  });
};

exports.searchById = function (req, res, next) {
  debug('GET entity by id service called.');
  var params = _.merge(req.params, req.body);
  if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  }
  EntityModel.findById({id: params.id}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.entityProfileStore = result;
    return next();
  });
};

exports.updateById = function (req, res, next) {
  debug('PUT entity service called.');

  var params = req.body;
  var data = {
    idnumber: params.idnumber,
    name: params.name,
    dba: params.dba,
    individual: params.individual,
    data: params.data,
    um: req.user.id || ''
  };
  data = _.pick(params, 'idnumber', 'name', 'dba', 'individual', 'data');

  var dataJson = req.body.data;
  if (dataJson.password) {
    var salt = bcrypt.genSaltSync(10);
    var password = bcrypt.hashSync(dataJson.password, salt);
    data.password = password;
  }

  var filter = {
    id: params.id
  };

  EntityModel.updateById({updateData: data, filter: filter}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.entityProfileStore = result;
    return next();
  });
};

exports.deleteById = function (req, res, next) {
  debug('DELETE entity service called.');
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(req.session.entityProfileStore)) {
    return next(new Boom.notFound('Entity not found'), null);
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid entity'), null);
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'), null);
  }
  EntityModel.deleteById({id: params.id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.entityProfileStore = {};
    return next();
  });
};

exports.newEntity = function (req, res, next) {
  debug('POST entity service called.');
  if (!_.isEmpty(req.session.entityProfileStore)) {
    return next(new Boom.conflict('Entity already exist.'));
  }
  var params = req.body;

  if (tipe(params.individual) === 'boolean') {
    if (params.individual) {
      params.individual = 'true';
    } else {
      params.individual = 'false';
    }
  }

  if (params.hasOwnProperty('password')) {
    var salt = bcrypt.genSaltSync(10);
    var password = bcrypt.hashSync(params.password, salt);
    params.password = password;
  }

  var newEntity1 = {};
  newEntity1.idnumber = params.idnumber || shortid.generate();
  newEntity1.name = params.name;
  newEntity1.dba = params.dba;
  newEntity1.individual = params.individual;
  newEntity1.data = params.data || {};
  newEntity1.tsc = Date.now();
  newEntity1.tsm = Date.now();
  newEntity1.uc = params.uc;
  newEntity1.um = req.user.id || '';
  newEntity1.dba = req.user.id || '';

  var newEntity2 = {};
  newEntity2.idnumber = params.idnumber || shortid.generate();
  newEntity2.name = params.name;
  newEntity2.dba = params.dba;
  newEntity2.individual = params.individual;
  newEntity2.data = params.data || {};
  newEntity2.tsc = Date.now();
  newEntity2.tsm = Date.now();
  newEntity2.uc = params.uc;
  newEntity2.um = req.user.id || '';
  newEntity2.dba = req.user.id || '';

  EntityModel.insert({newEntity1: newEntity1, newEntity2: newEntity2}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.entityProfileStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid entity'));
  });
};

exports.searchByEmail = function (req, res, next) {
  var params = req.body;
  if (_.isEmpty(params)) {
    return next();
  } else if (_.isEmpty(params.email)) {
    return next();
  }

  EntityModel.findByEmail({email: params.email}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.entityProfileStore = result;
    }
    return next();
  });
};

exports.loginEntity = function (req, res, next) {
  debug('Post entity login service called.');

  passport.authenticate('entity', {session: true}, function (error, user) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(user)) {
      req.session.entityProfileStore = user;
      return next();
    } else {
      return next(new Boom.notFound('Invalid entity'));
    }
  })(req, res, next);
};

exports.logoutEntity = function (req, res, next) {
  debug('Get entity logout service called.');

  if (_.isEmpty(req.user)) {
    return next(new Boom.notFound('Invalid entity'));
  } else if (_.isEmpty(req.user.uuid)) {
    return next(new Boom.notFound('Invalid uuid'));
  } else if (_.isEmpty(req.user.email)) {
    return next(new Boom.notFound('Invalid email'));
  }

  var data = {
    uuid: req.user.uuid,
    email: req.user.email
  };
  SessionModel.delete(data, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.entityProfileStore = {};
    return next();
  });
};

