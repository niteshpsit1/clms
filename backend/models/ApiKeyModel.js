'use strict';
var debug = require('debug')('LMS:ApiKeyModel');
/*
 * User model, defined as following:
 *
 * UserModel: [{
 *  id:         <integer>,
 *  name:       <string>,
 *  age:        <int>,
 *  email:      <string>,
 *  password:   <string>,
 *  data:       <json>
 *  tsc:        <timestamp>,
 *  tsm:        <timestamp>
 * }]
 *
 *
 * @author: Daniele Gazzelloni <daniele@danielegazzelloni.com>
 ********************************************************************/

var Boom = require('boom');
var _ = require('lodash');

var db = require('./../lib/db');

var ApiKey = db.sequelize.define('api_key', {

  id: {
    type: db.Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: db.Sequelize.STRING,
    defaultValue: 'system'
  },
  key: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: db.Sequelize.INTEGER
  },
  expires: {
    type: db.Sequelize.DATE,
    defaultValue: new Date(2099, 11, 31, 11, 0, 0, 0)
  },
  active: {
    type: db.Sequelize.ENUM('yes', 'no'),
    defaultValue: 'no'
  }
}, {
  updatedAt: 'tsc',
  createdAt: 'tsm'
});

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

exports.findByKey = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid User'));
  }else if (_.isEmpty(data.apiKey)) {
    return callback(new Boom.notFound('Invalid ApiKey'));
  }
  var filter = {};
  filter.where = {key: data.apiKey};

  ApiKey.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.unauthorized('Failed to authenticate, Api Key not found'), null);
    } else if (result.active === 'no') {
      return callback(new Boom.unauthorized('Failed to authenticate, Api Key is not active'), null);
    } else if ((+new Date()) > (+new Date(result.expires))) {
      return callback(new Boom.forbidden('Failed to authenticate, Api Key Expired'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    return callback(new Boom.notFound(error.message));
  });
};

/**
 * No parameters required
 *
 * This method will insert a new apiKey record into the database.
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid User'));
  } else if (_.isEmpty(data.newApiKey)) {
    return callback(new Boom.notFound('Invalid Data'));
  }
  console.log('newApiKey ', data.newApiKey);
  ApiKey.create(data.newApiKey).then(function (key) {
    if(_.isEmpty(key)){
      return callback(null, null);
    }
    return callback(null, key);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};
