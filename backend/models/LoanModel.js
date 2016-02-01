'use strict';
var debug = require('debug')('LMS:LoanModel');
/**
 * loan model, defined as following:
 *
 * loan: {
 *  id:           <integer>,
 *  loan_type_id: <integer>,
 *  principal:    <money>,
 *  loanterm:     <integer>,
 *  interestrate: <float>,
 *  startingdate: <date>,
 *  data:         <json>,
 *  tsc:          <date>,
 *  tsm:          <date>,
 *  uc:           <string>,
 *  um:           <string>
 * }
 *
 * Decimal and money types are meant as float types with two point decimal precision.
 *
 *
 * @author: Daniele Gazzelloni <daniele@danielegazzelloni.com>
 * @created: 15/10/2015
 ********************************************************************/

var _ = require('lodash');
var Boom = require('boom');

var db = require('./../lib/db');
var LoanEntityModel = require('./LoanEntityModel');
var EntityModel = require('./EntityModel');
var EntityRoleModel = require('./EntityRoleModel');

/**
 * loan model
 */

var LoanModel = db.sequelize.define('loan', {

  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  loan_type_id: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },

  principal: {
    type: 'MONEY',
    allowNull: false,
    defaultValue: 0.0
  },

  loanterm: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  interestrate: {
    type: db.Sequelize.STRING,
    allowNull: false,
    defaultValue: 0.0
  },

  startingdate: {
    type: db.Sequelize.DATEONLY,
    allowNull: true
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
exports.Schema = LoanModel;


/**
 * Get all loans from our loan model. An array of loans is returned.
 *
 *
 * @param:    entity_id: <integer>
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                          id: integer,
 *                          loan_type_id: integer,
 *                          principal: money,
 *                          loanterm: integer,
 *                          interestrate: decimal,
 *                          startingdate: date
 *                          tsc: date,
 *                          tsm: date,
 *                          uc: string,
 *                          um: string
 *                       }]
 */
exports.getAllLoan = function (data, callback) {

  LoanModel.findAll(data.filter).then(function (result) {
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
 * Get one loan from our loan model.
 * We expect the id as parameter, eg. 'http://<hostname>/loans/12345'.
 * If id is provided a single loan is returned (JSON).
 *
 *
 * @params:   id:       <int>
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   {
 *                          id: int,
 *                          loan_type_id: integer,
 *                          principal: money,
 *                          loanterm: integer,
 *                          interestrate: decimal,
 *                          startingdate: date
 *                          tsc: date,
 *                          tsm: date,
 *                          uc: string,
 *                          um: string
 *                       }
 */

exports.findById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid loan'));
  }else if (isNaN(data.id) || data.id==='') {
    return callback(new Boom.notFound('Invalid id'));
  }
  var filter = {
    where: {
      id: data.id
    },
    include: [
      {
        model: LoanEntityModel.Schema, as: 'LoanEntity', attributes: ['loan_id', 'entity_id', 'role_id'],
        include: [{model: EntityModel.Schema, as: 'Entity'},
          {model: EntityRoleModel.Schema, as: 'EntityRole', attributes: ['id', 'name']}]
      }
    ]
  };
  LoanModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('Loan not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

exports.findByLoanId = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid loan'));
  }else if (isNaN(data.loan_id) || data.loan_id==='') {
    return callback(new Boom.notFound('Invalid loanId'));
  }
  var filter = {
    where: {
      id: data.loan_id
    }
  };
  LoanModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('Loan not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

/**
 * Get all loans from our loan model, filtered by `entity_id`. An array of loans is returned.
 *
 *
 * @param:    entity_id: <integer>
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                          id: integer,
 *                          loan_type_id: integer,
 *                          principal: money,
 *                          loanterm: integer,
 *                          interestrate: decimal,
 *                          startingdate: date
 *                          tsc: date,
 *                          tsm: date,
 *                          uc: string,
 *                          um: string
 *                       }]
 */
exports.getForEntity = function (data, callback) {
  if (_.isEmpty(data.LoanEntityStore)) {
    return callback(new Boom.notFound('No loan found related to entity exist'));
  }

  var loanIds = _.map(data.LoanEntityStore, function (data) {
    return data['loan_id'];
  });

  LoanModel.findAll({where: {id: {$in: loanIds}}}).then(function (result) {
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
 * Get all entities from our loan_entity model, filtered by `loan_id`. An array of entities with detail is returned.
 *
 *
 * @param:    loan_id: <integer>
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                          id: integer,
 *                          loan_type_id: integer,
 *                          principal: money,
 *                          loanterm: integer,
 *                          interestrate: decimal,
 *                          startingdate: date
 *                          tsc: date,
 *                          tsm: date,
 *                          uc: string,
 *                          um: string
 *                       }]
 */
exports.getEntityForLoan = function (data, callback) {
  if (_.isEmpty(data.LoanEntityStore)) {
    return callback(new Boom.notFound('No loan found related to entity exist'));
  }
  var entityIds = _.map(data.LoanEntityStore, function (data) {
    return data['entity_id'];
  });
  EntityModel.Schema.findAll({where: {id: {$in: entityIds}}}).then(function (result) {
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
 * This method will update a loan db record.
 *
 * Decimal and money types are meant as float types with two point decimal precision.
 *
 *
 * @param:        id:             <integer>,
 *                loan_type_id:   <integer>,
 *                principal:      <money>,
 *                loanterm:       <integer>,
 *                interestrate:   <decimal>,
 *                startingdate:   <date>,
 *                entity_id:      <integer>,
 *                old_role_id:    <integer>,
 *                new_role_id:    <integer>
 *
 * @callback:     error:          <boolean>
 *                message:        <string>,
 *                results:        []
 */
exports.updateById = function (data, callback) {
  db.sequelize.transaction(function (t) {
    return LoanModel.findOne(data.filter).then(function (loan) {
      if (_.isEmpty(loan)) {
        return callback(new Boom.notFound('Loan not found'));
      } else {
        return loan.updateAttributes(data.updateData, {transaction: t}).then(function () {
          data.updatedLoanEntity.id = loan.LoanEntity[0].id;
          return loan.LoanEntity[0].updateAttributes(data.updatedLoanEntity, {transaction: t});
        });
      }
    });
  }).then(function (result) {
    return callback(null, result);
  }).catch(function (error) {
    return callback(error);
  });
};


/**
 * Required id.
 *
 * This method will delete a loan record from the database.
 *
 *
 * @param:        id:   <integer>
 *
 * @callback:     error: <boolean>,
 *                message: <string>,
 *                results: []
 */
exports.deleteById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid loan'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid loanId'));
  }

  var filter = {where: {id: data.id}};
  LoanModel.find(filter).then(function (loan) {
    if (_.isEmpty(loan)) {
      return callback(null, null);
    }
    loan.destroy().then(function () {
      return callback(null, true);
    }).catch(function (error) {
      debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
      return callback(new Boom.notFound(error.message));
    });
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * All parameters required except startingdate.
 * Decimal and money types are meant as float types with two point decimal precision.
 *
 * This method will insert a new loan record into the database.
 *
 * @param:        loan_type_id:   <integer>,
 *                principal:      <money>,
 *                loanterm:       <integer>,
 *                interestrate:   <decimal>,
 *                startingdate:   <date>,
 *                role_id:        <integer>
 *
 *
 * @callback:     error:          <boolean>
 *                message:        <string>,
 *                results:        []
 */
exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid loan'));
  }
  var newLoan = data.newLoan;
  if (_.isEmpty(newLoan)) {
    return callback(new Boom.notFound('Invalid loan'));
  }

  db.sequelize.transaction(function (t) {
    return LoanModel.create(newLoan, {include: [{model: LoanEntityModel.Schema, as: 'LoanEntity'}], transaction: t});
  }).then(function (result) {
    return callback(null, result.dataValues);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};
