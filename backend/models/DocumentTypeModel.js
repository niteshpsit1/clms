'use strict';
var debug = require('debug')('LMS:DocumentTypeModel');
/**
 * document_type data model, defined as following:
 *
 *
 * document_type: {
 *  id:                       <integer>,
 *  code:                     <string>,
 *  description:              <string>,
 *  validationdatauirements:   <string>,
 *  data:                     <json>,
 *  tsc:                      <date>,
 *  tsm:                      <date>,
 *  uc:                       <string>,
 *  um:                       <string>
 * }
 *
 *
 * Manually inserting a document_type value for testing purpose:
 * insert into 'document_types' (code, description, validationdatauirements, data, tsc, tsm, uc, um) values ('12345', 'TESTTYPE', 'NO', '{}', '2015-10-27 18:32:15.923+00', '2015-10-27 18:32:15.923+00', 'admin@admin.com', 'admin@admin.com'');
 *
 *
 * @author: Daniele Gazzelloni <daniele@danielegazzelloni.com>
 * @created: 27/10/2015
 ********************************************************************/

var Boom = require('boom');
var _ = require('lodash');

var db = require('./../lib/db');

/**
 * document_type model
 */
var DocumentTypeModel = db.sequelize.define('document_type', {

  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  code: {
    type: db.Sequelize.STRING,
    allowNull: false,
    unique: true
  },

  description: {
    type: db.Sequelize.STRING
  },

  validationrequirements: {
    type: db.Sequelize.STRING,
    allowNull: false
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
exports.Schema = DocumentTypeModel;

/**
 * Get all document_types from our document_type model.
 *
 * An array of document_type is returned.
 *
 *
 * @param:    none.
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: [{
 *                         id: integer,
 *                         code: string,
 *                         description: string,
 *                         validationdatauirements: string,
 *                         data: json,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                     }]
 */
exports.getAllDocumentTpye = function (data, callback) {
  var filter = {
    order: '"tsc" DESC'
  };
  DocumentTypeModel.findAll(filter).then(function (result) {
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
 * Get one document_type.
 * We expect an id as parameter, eg. 'http://<hostname>/document_types/123452313'.
 * If the id is provided a single document type is returned (JSON).
 *
 *
 * @params:   id: <integer>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: {
 *                         id: integer,
 *                         code: string,
 *                         description: string,
 *                         validationdatauirements: integer,
 *                         data: json,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                     }
 */

exports.findById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid documentType'));
  } else if (isNaN(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  DocumentTypeModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('DocumentType not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

exports.findByCode = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid documentType'));
  } else if (_.isEmpty(data.code)) {
    return callback(new Boom.notFound('Invalid code'));
  }

  var filter = {where: {code: data.code}};
  DocumentTypeModel.findOne(filter).then(function (result) {
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
 * This method will update a document_type model record.
 *
 *
 * @param:        id:                     <integer>,
 *                code:                   <string>,
 *                description:            <string>,
 *                validationdatauirements: <string>,
 *                data:                   <JSON>
 *
 * @callback:     error:      <boolean>
 *                message:    <string>,
 *                results:    []
 */
exports.updateById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid documentType'));
  } else if (isNaN(data.filter.id) || _.isEmpty(data.filter.id)) {
    return callback(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(data.updateData)) {
    return callback(new Boom.notFound('Invalid documentType'));
  }
  var filter = {where: {id: data.filter.id}};

  DocumentTypeModel.find(filter).then(function (documentType) {
    if (_.isEmpty(documentType)) {
      return callback(new Boom.notFound('DocumentType not found'), null);
    }
    documentType.update(data.updateData, filter).then(function (result) {
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
 * This method will delete a document_type record from the database.
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
    return callback(new Boom.notFound('Invalid documentType'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  DocumentTypeModel.find(filter).then(function (documentType) {
    if (_.isEmpty(documentType)) {
      return callback(new Boom.notFound('Invalid documentType'), null);
    }
    documentType.destroy().then(function () {
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
 * All parameters datauired except for data (which is a JSON optional data)
 *
 * This method will insert a new document_type record into the database.
 *
 * @param:        code:                   <string>,
 *                description:            <string>,
 *                validationdatauirements: <string>,
 *                data:                   <JSON>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid documentType'));
  }
  var newDocumentType = data.newDocumentType;
  if (_.isEmpty(newDocumentType)) {
    return callback(new Boom.notFound('Invalid documentType'));
  } else if (_.isEmpty(newDocumentType.code)) {
    return callback(new Boom.notFound('Invalid code'));
  }  else if (_.isEmpty(newDocumentType.validationrequirements)) {
    return callback(new Boom.notFound('Invalid validationrequirements'));
  }

  DocumentTypeModel.create(newDocumentType).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};