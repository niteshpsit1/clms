'use strict';
var debug = require('debug')('LMS:LedgerModel');
var Boom = require('boom');
var _ = require('lodash');

var db = require('./../lib/db');

var LedgerModel = db.sequelize.define('ledger', {
  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: db.Sequelize.STRING
  },
  loan_id: {
    type: db.Sequelize.INTEGER
  },
  account_id: {
    type: db.Sequelize.INTEGER
  },
  amount: {
    type: 'MONEY',
    allowNull: false,
    defaultValue: 0.0
  },
  projection: {
    type: db.Sequelize.STRING
  },
  datedue: {
    type: db.Sequelize.DATE
  },
  installment: {
    type: db.Sequelize.INTEGER
  },
  principal: {
    type: 'MONEY',
    defaultValue: 0.0
  },
  interest: {
    type: db.Sequelize.FLOAT,
    allowNull: false
  },
  balance: {
    type: 'MONEY',
    allowNull: false
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

exports.Schema = LedgerModel;


/**
 * Get all ledger records from our ledger model. An array of ledger is returned.
 *
 *
 * @param:    none.
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                      id:         <integer>,
 *                      name:       <string>,
 *                      loan_id:    <integer>,
 *                      account_id: <integer>,
 *                      amount:     <money>,
 *                      projection: <string>,
 *                      datedue:    <date>,
 *                      installment:<integer>,
 *                      principal:  <money>,
 *                      interest:   <float>,
 *                      balance:    <money>,
 *                      um:         <string>
 *                      uc:         <string>
 *                      tsc:        <date>
 *                      tsm:        <date>
 *                       }]
 */
exports.getAllLedger = function (data, callback) {
  // Select all ledger records
  var filter = {
    order: 'tsc DESC'
  };

  LedgerModel.findAll(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * Get one ledger from our ledger model.
 * We expect id as parameter, eg. 'http://<hostname>/ledgers/12345'.
 * A single ledger is returned (JSON).
 *
 *
 * @params:   id: <integer>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: {
 *                      id:         <integer>,
 *                      name:       <string>,
 *                      loan_id:    <integer>,
 *                      account_id: <integer>,
 *                      amount:     <money>,
 *                      projection: <string>,
 *                      datedue:    <date>,
 *                      installment:<integer>,
 *                      principal:  <money>,
 *                      interest:   <float>,
 *                      balance:    <money>,
 *                      um:         <string>
 *                      uc:         <string>
 *                      tsc:        <date>
 *                      tsm:        <date>
 *                     }
 */

exports.findById = function (data, callback) {

  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid ledger'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  LedgerModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('Ledger not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * Get all ledger records from our ledger model for account id. An array of ledger is returned.
 *
 *
 * @param:    account_id: integer.
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                      id:         <integer>,
 *                      name:       <string>,
 *                      loan_id:    <integer>,
 *                      account_id: <integer>,
 *                      amount:     <money>,
 *                      projection: <string>,
 *                      datedue:    <date>,
 *                      installment:<integer>,
 *                      principal:  <money>,
 *                      interest:   <float>,
 *                      balance:    <money>,
 *                      um:         <string>
 *                      uc:         <string>
 *                      tsc:        <date>
 *                      tsm:        <date>
 *                       }]
 */
exports.getAllLedgerByAccountId = function (data, callback) {
  var filter = {
    where: {
      account_id: data.account_id
    },
    order: 'tsc DESC'
  };

  LedgerModel.findAll(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });

};


/**
 * Get all ledger records from our ledger model for loan id. An array of ledger is returned.
 *
 *
 * @param:    loan_id: integer.
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                      id:         <integer>,
 *                      name:       <string>,
 *                      loan_id:    <integer>,
 *                      account_id: <integer>,
 *                      amount:     <money>,
 *                      projection: <string>,
 *                      datedue:    <date>,
 *                      installment:<integer>,
 *                      principal:  <money>,
 *                      interest:   <float>,
 *                      balance:    <money>,
 *                      um:         <string>
 *                      uc:         <string>
 *                      tsc:        <date>
 *                      tsm:        <date>
 *                       }]
 */
exports.getAllLedgerByLoanId = function (data, callback) {

  var filter = {
    where: {
      loan_id: data.loan_id
    },
    order: 'tsc DESC'
  };

  LedgerModel.findAll(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * We expect id as parameter, all the other parameters are instead optional.
 * This method will update an ledger model db record.
 *
 *
 * @param:      id:         <integer>,
 *              name:       <string>,
 *              loan_id:    <integer>,
 *              account_id: <integer>,
 *              amount:     <money>,
 *              projection: <string>,
 *              datedue:    <date>,
 *              installment:<integer>,
 *              principal:  <money>,
 *              interest:   <number>,
 *              balance:    <money>
 *
 * @callback:     error:      <boolean>
 *                message:    <string>,
 *                results:    []
 */
exports.updateById = function (data, callback) {

  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid ledger'));
  } else if (isNaN(data.filter.id) || _.isEmpty(data.filter.id)) {
    return callback(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(data.updateData)) {
    return callback(new Boom.notFound('Invalid ledger'));
  }
  var filter = {where: {id: data.filter.id}};

  LedgerModel.find(filter).then(function (ledger) {
    if (_.isEmpty(ledger)) {
      return callback(new Boom.notFound('Ledger not found'), null);
    }
    ledger.update(data.updateData, filter).then(function (result) {
      if (_.isEmpty(result)) {
        return callback(null, null);
      }
      return callback(null, result.dataValues);
    }).catch(function (error) {
      return callback(new Boom.notFound(error.message));
    });
  });
};


/**
 * Required id.
 *
 * This method will delete an ledger record from the database.
 *
 *
 * @param:        id:         <integer>
 *
 * @callback:     error:      <boolean>,
 *                message:    <string>,
 *                results:    []
 */
exports.deleteById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid ledger'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  LedgerModel.find(filter).then(function (ledger) {
    if (_.isEmpty(ledger)) {
      return callback(new Boom.notFound('Invalid ledger'), null);
    }
    ledger.destroy().then(function () {
      return callback(null, true);
    }).catch(function (error) {
      return callback(new Boom.notFound(error.message));
    });
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 *
 * This method will insert a new ledger record into the database.
 *
 * @param:      name:       <string>,
 *              loan_id:    <integer>,
 *              account_id: <integer>,
 *              amount:     <money>,
 *              projection: <string>,
 *              datedue:    <date>,
 *              installment:<integer>,
 *              principal:  <money>,
 *              interest:   <number>,
 *              balance:    <money>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid entityRole'), null);
  }
  var newLedger = data.newLedger;
  if (_.isEmpty(newLedger)) {
    return callback(new Boom.notFound('Invalid ledger'));
  } else if (_.isEmpty(newLedger.name)) {
    return callback(new Boom.notFound('Invalid name'));
  } else if (isNaN(newLedger.loan_id) || newLedger.loan_id === '') {
    return callback(new Boom.notFound('Invalid loanId'));
  } else if (isNaN(newLedger.account_id) || newLedger.account_id === '') {
    return callback(new Boom.notFound('Invalid accountId'));
  } else if (isNaN(newLedger.amount) || newLedger.amount === '') {
    return callback(new Boom.notFound('Invalid amount'));
  } else if (isNaN(newLedger.installment)) {
    return callback(new Boom.notFound('Invalid installment'));
  } else if (isNaN(newLedger.principal) || newLedger.principal === '') {
    return callback(new Boom.notFound('Invalid principal'));
  } else if (isNaN(newLedger.interest || newLedger.interest === '')) {
    return callback(new Boom.notFound('Invalid interest'));
  } else if (isNaN(newLedger.balance) || newLedger.balance === '') {
    return callback(new Boom.notFound('Invalid balance'));
  }
  LedgerModel.create(newLedger).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};