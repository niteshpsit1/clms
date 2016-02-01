'use strict';

var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var uuid = require('node-uuid');
var ms = require('ms');
var passport = require('passport');
var Boom = require('boom');
var async = require('async');
var _ = require('lodash');
var LocalStrategy = require('passport-local').Strategy;

var UserModel = require('./../models/UserModel');
var EntityModel = require('./../models/EntityModel');
var SessionModel = require('./../models/SessionModel');
var config = require('./../../config/backend.config.js');

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, callback) {
    //console.log('email ', email);
    //console.log('password ', password);
    var userProfileStore = {};

    async.series({
      findUser: function (insideCallback) {
        var filter = {};
        filter.where = {email: email};
        filter.raw = true;

        UserModel.findByFilter({filter: filter}, function (error, result) {
          if (!_.isEmpty(error)) {
            return insideCallback(error, null);
          } else if (_.isEmpty(result)) {
            return insideCallback(new Boom.notFound('User not found'), null);
          } else if (!_.isEmpty(result)) {
            userProfileStore = result;
          }
          return insideCallback();
        });
      },
      comparePassword: function (insideCallback) {
        bcrypt.compare(password, userProfileStore.password, function (error, isMatch) {
          if (!_.isEmpty(error)) {
            return insideCallback(new Boom.notFound(error.message), null);
          } else if (isMatch === false) {
            return insideCallback(new Boom.notFound('Authentication failed'), null);
          } else if (isMatch) {
            var encodedUser = {};
            encodedUser.id = userProfileStore.id;
            encodedUser.email = userProfileStore.email;
            encodedUser.name = userProfileStore.name;
            encodedUser.uuid = uuid.v1();

            userProfileStore.uuid = encodedUser.uuid;
            userProfileStore.token = jwt.sign(encodedUser, config.jwt.secret, {
              expiresIn: config.session.expiry + 'm',
              algorithm: 'HS256'
            });
            delete encodedUser.iat;
            delete encodedUser.exp;
            delete userProfileStore.password;
          }
          return insideCallback();
        });
      },
      storeUserSession: function (insideCallback) {
        var newSession = {};
        newSession.sid = userProfileStore.uuid;
        newSession.email = userProfileStore.email;
        newSession.userId = userProfileStore.id;
        newSession.expires = ((+new Date()) + ms(config.session.expiry + 'm'));
        newSession.type = 'agent';
        delete userProfileStore.uuid;
        SessionModel.insert({newSession: newSession}, function (error, result) {
          if (!_.isEmpty(error)) {
            return insideCallback(error, null);
          }
          console.log('session ', result);
          return insideCallback();
        });
      }
    }, function (error) {
      if (!_.isEmpty(error)) {
        return callback(error, null);
      }
      return callback(null, userProfileStore);
    });
  }
));

passport.use('entity', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, callback) {
    console.log('email ', email);
    console.log('password ', password);
    var entityProfileStore = {};

    async.series({
      findEntity: function (insideCallback) {
        var filter = {};
        filter.where = {email: email};

        EntityModel.findByFilter({filter: filter}, function (error, result) {
          if (!_.isEmpty(error)) {
            return insideCallback(error, null);
          } else if (_.isEmpty(result)) {
            return insideCallback(new Boom.notFound('Entity not found'), null);
          }
          var data = result.data;
          if (!data.hasOwnProperty('password')) {
            return insideCallback(new Boom.notFound('No password is associated with this entity, cant login'), null);
          }
          if (!_.isEmpty(result)) {
            entityProfileStore = result;
          }
          return insideCallback();
        });
      },
      comparePassword: function (insideCallback) {
        bcrypt.compare(password, entityProfileStore.password, function (error, isMatch) {
          if (!_.isEmpty(error)) {
            return insideCallback(new Boom.notFound(error.message), null);
          } else if (isMatch === false) {
            return insideCallback(new Boom.notFound('Authentication failed'), null);
          } else if (isMatch) {
            var encodedUser = {};
            encodedUser.id = entityProfileStore.id;
            encodedUser.email = entityProfileStore.email;
            encodedUser.name = entityProfileStore.name;
            encodedUser.uuid = uuid.v1();

            entityProfileStore.uuid = encodedUser.uuid;
            entityProfileStore.token = jwt.sign(encodedUser, config.jwt.secret, {
              expiresIn: config.session.expiry + 'm',
              algorithm: 'HS256'
            });
            delete encodedUser.iat;
            delete encodedUser.exp;
            delete entityProfileStore.password;
          }
          return insideCallback();
        });
      },
      storeUserSession: function (insideCallback) {
        var newSession = {};
        newSession.sid = entityProfileStore.uuid;
        newSession.email = entityProfileStore.email;
        newSession.userId = entityProfileStore.id;
        newSession.expires = ((+new Date()) + ms(config.session.expiry + 'm'));
        newSession.type = 'entity';
        delete entityProfileStore.uuid;
        SessionModel.insert({newSession: newSession}, function (error, result) {
          if (!_.isEmpty(error)) {
            return insideCallback(error, null);
          }
          return insideCallback();
        });
      }
    }, function (error) {
      if (!_.isEmpty(error)) {
        return callback(error, null);
      }
      return callback(null, entityProfileStore);
    });
  }
));

module.exports = passport;