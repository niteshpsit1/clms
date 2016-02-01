'use strict';

var debug = require('debug')('LMS:UserController');

var Boom = require('boom');
var _ = require('lodash');

exports.registerUser = function (req, res, next) {
  if (_.isEmpty(req.session.userProfileStore)) {
    return next(new Boom.conflict('Invalid user'));
  }
  req.session.result = req.session.userProfileStore;
  return next();
};

exports.loginUser = function (req, res, next) {
  var userProfileStore = req.session.userProfileStore;
  if (_.isEmpty(userProfileStore)) {
    return next(new Boom.notFound('Invalid login detail'));
  }
  req.session.result = userProfileStore;
  return next();
};

exports.logoutUser = function (req, res, next) {
  var userProfileStore = req.session.userProfileStore;
  if (!_.isEmpty(userProfileStore)) {
    return next(new Boom.notFound('Logout failed'));
  }
  req.session.result = {message: true, text: 'Logout successful'};
  return next();
};

exports.getUser = function (req, res, next) {
  var userProfileStore = req.session.userProfileStore;
  if (_.isEmpty(userProfileStore)) {
    return next(new Boom.notFound('User not found'));
  }
  req.session.result = userProfileStore;
  return next();
};

exports.getNewUser = function (req, res, next) {
  var userProfileStore = req.session.userProfileStore;
  if (_.isEmpty(userProfileStore)) {
    return next(new Boom.notFound('Invalid user'));
  }
  req.session.result = userProfileStore;
  return next();
};


exports.getUpdatedUser = function (req, res, next) {
  var userProfileStore = req.session.userProfileStore;
  if (_.isEmpty(userProfileStore)) {
    return next(new Boom.notFound('Failed to update user'));
  }
  req.session.result = userProfileStore;
  return next();
};

exports.deleteUser = function (req, res, next) {
  var userProfileStore = req.session.userProfileStore;
  if (!_.isEmpty(userProfileStore)) {
    return next(new Boom.notFound('Failed to delete user'));
  }
  req.session.result = {message: true, text: 'Delete successful'};
  return next();
};