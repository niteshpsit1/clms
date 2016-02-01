'use strict';
var debug = require('debug')('LMS:CollateralModel');
/**
 *
 * collateral model, defined as following:
 *
 * collateral: {
 *  id:             <integer>,
 *  name:           <string>,
 *  valuation:      <string>,
 *  entity_id:      <integer>,
 *  loan_id:        <integer>,
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
 * Collateral model
 */
var Boom = require('boom');
var _ = require('lodash');

var db = require('./../lib/db');

var CollateralModel = db.sequelize.define('collateral', {

  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: db.Sequelize.STRING
  },
  valuation: {
    type: db.Sequelize.STRING
  },
  entity_id: {
    type: db.Sequelize.INTEGER
  },
  loan_id: {
    type: db.Sequelize.INTEGER
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

exports.Schema = CollateralModel;


/**
 * Get all collateral records from our collateral model. An array of collateral is returned.
 *
 *
 * @param:    none.
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                          id:         <integer>,
 *                          name:       <string>,
 *                          valuation:  <string>
 *                          entity_id:  <integer>
 *                          loan_id:    <integer>
 *                          data:       <json>
 *                          uc:         <string>
 *                          um:         <string>
 *                          tsc:         <date>
 *                          tsm:         <date>
 *                       }]
 */
exports.getAllCollateral = function (data, callback) {
  var filter = {
    order: '"tsc" DESC'
  };
  CollateralModel.findAll(filter).then(function (result) {
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
 * Get one collateral from our collateral model.
 * We expect id as parameter, eg. 'http://<hostname>/collateral/12345'.
 * A single collateral is returned (JSON).
 *
 *
 * @param:    id: integer.
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                          id:         <integer>,
 *                          name:       <string>,
 *                          valuation:  <string>
 *                          entity_id:  <integer>
 *                          loan_id:    <integer>
 *                          data:       <json>
 *                          uc:         <string>
 *                          um:         <string>
 *                          tsc:         <date>
 *                          tsm:         <date>
 *                       }]
 */

exports.findById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid collateral'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  CollateralModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('Collateral not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * We expect id, entity_id,loan_id  as parameter, all the other parameters are instead optional.
 * This method will update an collateral model db record.
 *
 *
 * @param:        name:       <string>,
 *                valuation:  <string>
 *                entity_id:  <string>
 *                loan_id:    <string>
 *                data:       <json>
 *                uc:         <string>
 *                um:         <string>
 *
 * @callback:     error:      <boolean>
 *                message:    <string>,
 *                results:    []
 */
exports.updateById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid collateral'));
  } else if (isNaN(data.filter.id) || _.isEmpty(data.filter.id)) {
    return callback(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(data.updateData)) {
    return callback(new Boom.notFound('Invalid collateral'));
  }
  var filter = {where: {id: data.filter.id}};

  CollateralModel.find(filter).then(function (collateral) {
    if (_.isEmpty(collateral)) {
      return callback(new Boom.notFound('Collateral not found'), null);
    }
    collateral.update(data.updateData, filter).then(function (result) {
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
 * This method will delete an collateral record from the database.
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
    return callback(new Boom.notFound('Invalid collateral'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  CollateralModel.find(filter).then(function (collateral) {
    if (_.isEmpty(collateral)) {
      return callback(new Boom.notFound('Invalid collateral'), null);
    }
    collateral.destroy().then(function () {
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
 * Parameter `name`,`valuation`, `entity_id`, `loan_id`  datauired, all other optional optional:
 *
 * This method will insert a new collateral record into the database.
 *
 * @param:        name:       <string>,
 *                valuation:  <string>
 *                entity_id:  <string>
 *                loan_id:    <string>
 *                data:       <json>
 *                uc:         <string>
 *                um:         <string>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid collateral'), null);
  }
  var newCollateral = data.newCollateral;
  if (_.isEmpty(newCollateral)) {
    return callback(new Boom.notFound('Invalid collateral'), null);
  } else if (_.isEmpty(newCollateral.name)) {
    return callback(new Boom.notFound('Invalid name'), null);
  } else if (isNaN(newCollateral.entity_id)) {
    return callback(new Boom.notFound('Invalid entity_id'), null);
  } else if (isNaN(newCollateral.loan_id)) {
    return callback(new Boom.notFound('Invalid loan_id'), null);
  }

  CollateralModel.create(newCollateral).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * Get collateral for defined entity from our collateral model.
 * We expect entity_id as parameter, eg. 'http://<hostname>/api/collateral/for_entity/:entity_id'.
 *
 *
 * @params:   entity_id: <integer>
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                          id:         <integer>,
 *                          name:       <string>,
 *                          valuation:  <string>
 *                          entity_id:  <integer>
 *                          loan_id:    <integer>
 *                          data:       <json>
 *                          uc:         <string>
 *                          um:         <string>
 *                          tsc:         <date>
 *                          tsm:         <date>
 *                       }]
 */

exports.getAllCollateralByEntityId = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid collateral'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {entity_id: data.id}};
  CollateralModel.findAll(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('Collateral not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * Get collateral for defined loan from our collateral model.
 * We expect loan_id as parameter, eg. 'http://<hostname>/api/collateral/for_loan/:loan_id'.
 *
 *
 * @params:   loan_id: <integer>
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                          id:         <integer>,
 *                          name:       <string>,
 *                          valuation:  <string>
 *                          entity_id:  <integer>
 *                          loan_id:    <integer>
 *                          data:       <json>
 *                          uc:         <string>
 *                          um:         <string>
 *                          tsc:         <date>
 *                          tsm:         <date>
 *                       }]
 */

exports.getAllCollateralByLoanId = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid collateral'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {loan_id: data.id}};
  CollateralModel.findAll(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('Collateral not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

