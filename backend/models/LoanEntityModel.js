'use strict';
var debug = require('debug')('LMS:LoanEntityModel');
/**
 * loan-entity data model, defined as following:
 *
 * loan-entity: {
 *  id:               <integer>,
 *  loan_id:          <integer>
 *  entity_id:        <integer>,
 *  role_id:          <integer>,
 *  tsc:              <date>,
 *  tsm:              <date>,
 *  uc:               <string>,
 *  um:               <string>
 * }
 *
 *
 * @author: Daniele Gazzelloni <daniele@danielegazzelloni.com>
 * @created: 05/11/2015
 ********************************************************************/
var Boom = require('boom');
var _ = require('lodash');

var db = require('./../lib/db');

/**
 * loan-entity model
 */

var LoanEntityModel = db.sequelize.define('loan_entity', {
   id: {
      type: db.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    loan_id: {
      type: db.Sequelize.INTEGER,
      unique: 'loanEntityUniqueConstraint'
      //primaryKey: true
    },

    entity_id: {
      type: db.Sequelize.INTEGER,
      unique: 'loanEntityUniqueConstraint'
      //primaryKey: true
    },

    role_id: {
      type: db.Sequelize.INTEGER,
      unique: 'loanEntityUniqueConstraint'
      //primaryKey: true
    },

    uc: {
      type: db.Sequelize.STRING
    },

    um: {
      type: db.Sequelize.STRING
    }

  },
  {
    updatedAt: 'tsc',
    createdAt: 'tsm'
  });

exports.Schema = LoanEntityModel;


exports.getAllLoanEntity = function (data, callback) {
  var filter = {
    order: '"tsc" DESC'
  };
  LoanEntityModel.findAll(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

exports.findAllEntityIdByLoanId = function (data, callback) {
  var filter = {
    where : {loan_id: data.id},
    attributes: [[db.Sequelize.literal('DISTINCT(entity_id)'), 'entity_id']]
  };
  LoanEntityModel.findAll(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

exports.findAllLoanIdByEntityId = function (data, callback) {
  var filter = {
    where : {entity_id: data.id},
    attributes: [[db.Sequelize.literal('DISTINCT(loan_id)'), 'loan_id']]
  };
  LoanEntityModel.findAll(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};