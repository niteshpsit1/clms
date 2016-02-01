'use strict';
var debug = require('debug')('LMS:LoanTypeModel');
/**
 *
 * loan_type model, defined as following:
 *
 * loan_type: {
 *  id:             <integer>,
 *  code:           <string>,
 *  descrption:     <string>,
 *  payment_cycle:  <string>,
 *  loan_system:    <string>,
 *  data:           <json>,
 *  um:             <string>
 *  uc:             <string>
 *  tsc:            <date>
 *  tsm:            <date>
 * }
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 20/11/2015
 */

/**
 * LoanType model
 */
var Boom = require('boom');
var _ = require('lodash');

var db = require('./../lib/db');

var LoanTypeModel = db.sequelize.define('loan_type', {

  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: db.Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  descrption: {
    type: db.Sequelize.STRING
  },
  payment_cycle: {
    type: db.Sequelize.STRING
  },
  loan_system: {
    type: db.Sequelize.STRING
  },
  data: {
    type: db.Sequelize.JSONB
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

exports.Schema = LoanTypeModel;

/**
 * Get all loan_type records from our loan_type model. An array of loan_type is returned.
 *
 *
 * @param:    none.
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                          id: integer,
 *                          name: string,
 *                          description: string,
 *                          tsc: date,
 *                          tsm: date,
 *                          uc: string,
 *                          um: string
 *                       }]
 */
exports.getAllLoanTpye = function (data, callback) {
  var filter = {
    order: '"tsc" DESC'
  };
  LoanTypeModel.findAll(filter).then(function (result) {
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
 * Get one loan_type from our loan_type model.
 * We expect id as parameter, eg. 'http://<hostname>/loan_type/12345'.
 * A single loan_type is returned (JSON).
 *
 *
 * @params:   id: <integer>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: {
 *                         id: integer,
 *                         name: string,
 *                         description: string,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                     }
 */

exports.findById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid loanType'));
  } else if (isNaN(data.id) || data.id==='') {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  LoanTypeModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('LoanType not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

exports.findByCode = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid loanType'));
  } else if (_.isEmpty(data.code)) {
    return callback(new Boom.notFound('Invalid code'));
  }

  var filter = {where: {code: data.code}};
  LoanTypeModel.findOne(filter).then(function (result) {
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
 * This method will update an loan_type model db record.
 *
 *
 * @param:        id:         <integer>,
 *                name:       <string>,
 *                description:<string>
 *
 * @callback:     error:      <boolean>
 *                message:    <string>,
 *                results:    []
 */
exports.updateById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid loanType'));
  } else if (isNaN(data.filter.id) || _.isEmpty(data.filter.id)) {
    return callback(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(data.updateData)) {
    return callback(new Boom.notFound('Invalid loanType'));
  }
  var filter = {where: {id: data.filter.id}};

  LoanTypeModel.find(filter).then(function (loanType) {
    if (_.isEmpty(loanType)) {
      return callback(new Boom.notFound('LoanType not found'), null);
    }
    loanType.update(data.updateData, filter).then(function (result) {
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
 * datauired id.
 *
 * This method will delete an loan_type record from the database.
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
    return callback(new Boom.notFound('Invalid loanType'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  LoanTypeModel.find(filter).then(function (loanType) {
    if (_.isEmpty(loanType)) {
      return callback(new Boom.notFound('Invalid loanType'), null);
    }
    loanType.destroy().then(function () {
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
 * Parameter 'name' datauired, 'description' is instead optional
 *
 * This method will insert a new loan_type record into the database.
 *
 * @param:        name:       <string>,
 *                description:<string>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid loanType'));
  }
  var newLoanType = data.newLoanType;
  if (_.isEmpty(newLoanType)) {
    return callback(new Boom.notFound('Invalid loanType'));
  } else if (_.isEmpty(newLoanType.code)) {
    return callback(new Boom.notFound('Invalid code'));
  } else if (isNaN(newLoanType.payment_cycle)) {
    return callback(new Boom.notFound('Invalid payment cycle'));
  } else if (_.isEmpty(newLoanType.loan_system)) {
    return callback(new Boom.notFound('Invalid loan system'));
  }

  LoanTypeModel.create(newLoanType).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};