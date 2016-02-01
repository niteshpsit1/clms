'use strict';
var debug = require('debug')('LMS:CollateralDocumentModel');
/**
 *
 * collateral_document model, defined as following:
 *
 * collateral_document: {
 *  id:             <integer>,
 *  collateral_id:  <integer>,
 *  document_id:    <integer>,
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
 * CollateralDocument model
 */
var Boom = require('boom');
var _ = require('lodash');

var db = require('./../lib/db');

var CollateralDocumentModel = db.sequelize.define('collateral_document', {

  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  collateral_id: {
    type: db.Sequelize.INTEGER,
    unique: 'collateralDocumentUniqueConstraint'
  },
  document_id: {
    type: db.Sequelize.INTEGER,
    unique: 'collateralDocumentUniqueConstraint'
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
exports.Schema = CollateralDocumentModel;


/**
 * Get all collateral_document records from our collateral_document model. An array of collateral_document is returned.
 *
 *
 * @param:    none.
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *              id:             <integer>,
 *              collateral_id:  <integer>,
 *              document_id:    <integer>,
 *              um:             <string>
 *              uc:             <string>
 *              tsc:            <date>
 *              tsm:            <date>
 *            }]
 */
exports.getAllCollateralDocument = function (data, callback) {
  var filter = {
    order: '"tsc" DESC'
  };
  CollateralDocumentModel.findAll(filter).then(function (result) {
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
 * Get one collateral_document from our collateral_document model.
 * We expect id as parameter, eg. 'http://<hostname>/api/collateral_documents/12345'.
 * A single collateral_document is returned (JSON).
 *
 *
 * @params:   id: <integer>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: {
 *              id:             <integer>,
 *              collateral_id:  <integer>,
 *              document_id:    <integer>,
 *              um:             <string>
 *              uc:             <string>
 *              tsc:            <date>
 *              tsm:            <date>
 *            }
 */

exports.findById = function (data, callback) {

  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid collateralDocument'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  CollateralDocumentModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('CollateralDocument not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

exports.findByCollateralId = function (data, callback) {

  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid collateralDocument'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {collateral_id: data.id}};
  CollateralDocumentModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('CollateralDocument not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

exports.findAllDocumentIdByCollateralId = function (data, callback) {
  var filter = {
    where: {collateral_id: data.id},
    attributes: ['document_id']
  };
  CollateralDocumentModel.findAll(filter).then(function (result) {
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
 * This method will update an collateral_document model db record.
 *
 *
 * @param:        id:                <integer>>
 *                document_id:       <integer>
 *                collateral_id:     <integer>
 *                uc:                <string>
 *                um:                <string>
 *
 * @callback:     error:      <boolean>
 *                message:    <string>,
 *                results:    []
 */
exports.updateById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid collateralDocument'));
  } else if (isNaN(data.filter.id) || _.isEmpty(data.filter.id)) {
    return callback(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(data.updateData)) {
    return callback(new Boom.notFound('Invalid collateralDocument'));
  }
  var filter = {where: {id: data.filter.id}};

  CollateralDocumentModel.find(filter).then(function (collateralDocument) {
    if (_.isEmpty(collateralDocument)) {
      return callback(new Boom.notFound('CollateralDocument not found'), null);
    }
    collateralDocument.update(data.updateData, filter).then(function (result) {
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
 * This method will delete an collateral_document record from the database.
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
    return callback(new Boom.notFound('Invalid collateralDocument'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  CollateralDocumentModel.find(filter).then(function (collateralDocument) {
    if (_.isEmpty(collateralDocument)) {
      return callback(new Boom.notFound('Invalid collateralDocument'), null);
    }
    collateralDocument.destroy().then(function () {
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
 * Required loan_id.
 *
 * This method will delete all an collateral_document record from the database for given collateral_id.
 *
 *
 * @param:        collateral_id:    <integer>
 *
 * @callback:     error:      <boolean>,
 *                message:    <string>,
 *                results:    []
 */
exports.deleteAllCollateralDocumentByCollateralId = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid collateralDocument'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {collateral_id: data.id}};
  CollateralDocumentModel.destroy(filter).then(function () {
    return callback(null, true);
  }).catch(function (error) {
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * Parameter 'document_id', `collateral_id` required, 'uc', `um` is instead optional
 *
 * This method will insert a new collateral_document record into the database.
 *
 * @param:        document_id:      <integer>,
 *                collateral_id:    <integer>
 *                uc:               <string>
 *                um:               <string>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid collateralDocument'), null);
  }
  var newCollateralDocument = data.newCollateralDocument;
  if (_.isEmpty(newCollateralDocument)) {
    return callback(new Boom.notFound('Invalid collateralDocument'), null);
  } else if (isNaN(newCollateralDocument.document_id) || newCollateralDocument.document_id==='') {
    return callback(new Boom.notFound('Invalid documentId'), null);
  } else if (isNaN(newCollateralDocument.collateral_id) || newCollateralDocument.collateral_id==='') {
    return callback(new Boom.notFound('Invalid collateralId'), null);
  }

  CollateralDocumentModel.create(newCollateralDocument).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};
