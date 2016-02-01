'use strict';
var debug = require('debug')('LMS:AccountModel');
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

var AccountModel = db.sequelize.define('account', {

  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: db.Sequelize.STRING
  },
  uc: {
    type: db.Sequelize.STRING
  },
  um: {
    type: db.Sequelize.STRING
  }
}, {
  updatedAt: 'tsc',
  createdAt: 'tsm'
});

exports.Schema = AccountModel;

exports.findById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid account'));
  } else if (isNaN(data.id) || _.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }
  var filter = {where: {id: data.id}};

  AccountModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};