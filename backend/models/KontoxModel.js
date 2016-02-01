//'use strict';
var debug = require('debug')('LMS:KontoxModel');
/**
 * KontoxModelModel.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 11/12/2015
 */

var Boom = require('boom');
var db = require('./../lib/db');
var _ = require('lodash');


var KontoxModel = db.sequelize.define('kontox', {
  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  entity_id: {
    type: db.Sequelize.INTEGER
    //allowNull: false
  },
  accountInfo: {
    type: db.Sequelize.JSONB
  },
  accountTransactions: {
    type: db.Sequelize.JSONB
  },
  accountOwners: {
    type: db.Sequelize.JSONB
  }
}, {
  updatedAt: 'tsc',
  createdAt: 'tsm'
});

exports.Schema = KontoxModel;


exports.findByEntityId = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid entity'));
  } else if (_.isEmpty(data.entity_id)) {
    return callback(new Boom.notFound('Invalid entityId'));
  }

  var filter = {where: {entity_id: data.entity_id}};
  KontoxModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('Kontox not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * data parameter required
 *
 * This method will insert a new kontox record into the database.
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid , no data is found'));
  } else if (_.isEmpty(data.entity_id)) {
    return callback(new Boom.notFound('Invalid entity_id'));
  }

  KontoxModel.create(data).then(function (result) {
    if(_.isEmpty(result)){
      return callback(null, null);
    }
    return callback(null, result);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};