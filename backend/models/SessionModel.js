'use strict';
var debug = require('debug')('LMS:SessionModel');
var _ = require('lodash');
var Boom = require('boom');

var db = require('./../lib/db');

var SessionModel = db.sequelize.define('session', {
    sid: {
      type: db.Sequelize.UUID,
      defaultValue: db.Sequelize.UUIDV1,
      primaryKey: true
    }, email: {
      type: db.Sequelize.STRING,
      allowNull: false
    }, userId: {
      type: db.Sequelize.INTEGER,
      allowNull: false
    }, expires: {
      type: db.Sequelize.DATE,
      allowNull: true
    }, type: {
      type: db.Sequelize.STRING,
      allowNull: false
    }
  }, {
    indexes: [
      {
        name: 'session_email_index',
        method: 'BTREE',
        fields: ['email']
      }
    ],
    updatedAt: 'tsc',
    createdAt: 'tsm'
  }
);
exports.Schema = SessionModel;
/**
 * Get one session from our Session model.
 * If an sid is provided a single session is returned (JSON)
 *
 * @params:    sid: <int>
 *
 * @callback: error: boolean,
 *            message: string,
 *            result: { }
 */
exports.getOne = function (data, callback) {
  //console.log('Inside getOne');
  //console.log(data.uuid);
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid user'));
  } else if (_.isEmpty(data.uuid)) {
    return callback(new Boom.notFound('Invalid uuid'));
  } else if (_.isEmpty(data.email)) {
    return callback(new Boom.notFound('Invalid email'));
  }
  var filter = {};
  filter.where = {sid: data.uuid};
  SessionModel.findOne(filter).then(function (session) {
    if (_.isEmpty(session)) {
      return callback(new Boom.forbidden('Failed to authenticate token, Token Expired'), null);
    } else if ((+new Date(session.expires)) > (+new Date())) {
      if (data.email === session.email) {
        return callback(null, session);
      } else {
        return callback(new Boom.forbidden('Failed to authenticate token.'), null);
      }
    }
    return callback(new Boom.forbidden('Failed to authenticate token, Token Expired'), null);
  }).error(function (error) {
    return callback(new Boom.notFound(error.message), null);
  });
};

/**
 * We expect token as parameter. This method will delete the db entry in Users model
 * identified with the 'id' parameter.
 *
 * @callback:     error: boolean,
 *                message: string,
 *                results: []
 */
exports.delete = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid user'));
  } else if (_.isEmpty(data.uuid)) {
    return callback(new Boom.notFound('Invalid uuid'));
  } else if (_.isEmpty(data.email)) {
    return callback(new Boom.notFound('Invalid email'));
  }
  var filter = {where: {sid: data.uuid}};
  SessionModel.findOne(filter).then(function (session) {
    if (_.isEmpty(session)) {
      return callback(new Boom.notFound('Failed to authenticate token.'), null);
    }
    if (data.email === session.email) {
      session.destroy().then(function () {
        return callback(null, null);
      }).error(function (error) {
        return callback(new Boom.notFound(error.message), null);
      });
    } else {
      return callback(new Boom.forbidden('Failed to authenticate token.'), null);
    }
  }).error(function (error) {
    return callback(new Boom.notFound(error.message), null);
  });
};

exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid user'), null);
  }
  var newSession = data.newSession;
  if (_.isEmpty(newSession)) {
    return callback(new Boom.notFound('Invalid user'), null);
  } else if (_.isEmpty(newSession.sid)) {
    return callback(new Boom.notFound('Invalid sid'), null);
  } else if (isNaN(newSession.userId)) {
    return callback(new Boom.notFound('Invalid userId'), null);
  } else if (_.isEmpty(newSession.email)) {
    return callback(new Boom.notFound('Invalid email'), null);
  } else if (isNaN(newSession.expires)) {
    return callback(new Boom.notFound('Invalid expires'), null);
  } else if (_.isEmpty(newSession.type)) {
    return callback(new Boom.notFound('Invalid type'), null);
  }
  SessionModel.create(newSession).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message), null);
  });
};