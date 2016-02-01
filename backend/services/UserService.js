'use strict';

var debug = require('debug')('LMS:UserService');

var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var Boom = require('boom');
var _ = require('lodash');

var SessionModel = require('./../models/SessionModel');
var UserModel = require('./../models/UserModel');

exports.validateLoginParams = function (req, res, next) {
  var params = req.body;
  if (_.isEmpty(params.email)) {
    return next(new Boom.notFound('Invalid email'));
  } else if (_.isEmpty(params.password)) {
    return next(new Boom.notFound('Invalid password'));
  }
  return next();
};

exports.validateUserParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid user'));
  } else if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'));
  } else if (isNaN(params.age) || params.age === '') {
    return next(new Boom.notFound('Invalid age'));
  } else if (_.isEmpty(params.email)) {
    return next(new Boom.notFound('Invalid email'));
  } else if (_.isEmpty(params.password)) {
    return next(new Boom.notFound('Invalid password'));
  }
  req.body.email = req.body.email.toLowerCase();
  return next();
};

exports.validateSignUpParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid user'));
  } else if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'));
  } else if (isNaN(params.age) || params.age === '') {
    return next(new Boom.notFound('Invalid age'));
  } else if (_.isEmpty(params.email)) {
    return next(new Boom.notFound('Invalid email'));
  } else if (_.isEmpty(params.password)) {
    return next(new Boom.notFound('Invalid password'));
  }
  req.body.email = req.body.email.toLowerCase();
  return next();
};

exports.validateUpdateUserParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid user'));
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'));
  } else if (isNaN(params.age) || params.age === '') {
    return next(new Boom.notFound('Invalid age'));
  } else if (_.isEmpty(params.email)) {
    return next(new Boom.notFound('Invalid email'));
  } else if (_.isEmpty(params.password)) {
    return next(new Boom.notFound('Invalid password'));
  }
  return next();
};

exports.login = function (req, res, next) {
  debug('Post login service called.');

  passport.authenticate('local', {session: true}, function (error, user) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(user)) {
      req.session.userProfileStore = user;
      return next();
    } else {
      return next(new Boom.notFound('Invalid user'));
    }
  })(req, res, next);
};

exports.logout = function (req, res, next) {
  if (_.isEmpty(req.user)) {
    return next(new Boom.notFound('Invalid user'));
  } else if (_.isEmpty(req.user.uuid)) {
    return next(new Boom.notFound('Invalid uuid'));
  } else if (_.isEmpty(req.user.email)) {
    return next(new Boom.notFound('Invalid email'));
  }
  var data = {
    uuid: req.user.uuid,
    email: req.user.email
  };
  SessionModel.delete(data, function (error, result) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.userProfileStore = result;
    return next();
  });
};

exports.getAllUser = function (req, res, next) {
  debug('GET UserModel service called.');
  UserModel.getAllUser({}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.userProfileStore = result;
    return next();
  });
};

exports.searchById = function (req, res, next) {
  debug('GET UserModel by id service called.');
  var params = _.merge(req.params, req.body);
  if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  }
  UserModel.findById({id: params.id}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.userProfileStore = result;
    return next();
  });
};

exports.updateById = function (req, res, next) {
  debug('PUT UserModel service called.');
  var params = req.body;

  var data = {
    name: params.name,
    age: params.age,
    email: params.email,
    password: params.password,
    tsm: Date.now()
  };
  data = _.pick(params, 'name', 'age', 'email', 'password');
  var filter = {
    id: params.id
  };

  UserModel.updateById({updateData: data, filter: filter}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.userProfileStore = result;
    return next();
  });
};

exports.deleteById = function (req, res, next) {
  debug('DELETE UserModel service called.');
  var params = _.merge(req.params, req.body);

  if (_.isEmpty(req.session.userProfileStore)) {
    return next(new Boom.notFound('User not found'), null);
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid user'), null);
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'), null);
  }
  UserModel.deleteById({id: params.id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.userProfileStore = {};
    return next();
  });
};

exports.newUser = function (req, res, next) {
  debug('POST UserModel service called.');
  if (!_.isEmpty(req.session.userProfileStore)) {
    return next(new Boom.conflict('User already exist'));
  }
  var params = req.body;
  var newUser = {};
  newUser.name = params.name;
  newUser.age = params.age;
  newUser.email = params.email;
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(params.password, salt);
  newUser.password = hash;

  UserModel.insert({newUser: newUser}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.userProfileStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid user'));
  });
};

exports.searchByEmail = function (req, res, next) {
  var params = req.body;
  if (_.isEmpty(params)) {
    return next();
  } else if (_.isEmpty(params.email)) {
    return next();
  }
  UserModel.findByEmail({email: params.email}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.userProfileStore = result;
    }
    return next();
  });
};