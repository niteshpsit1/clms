'use strict';
var debug = require('debug')('LMS:EntityDocumentModel');
/**
 * entity_document data model, defined as following:
 *
 * entity_document: {
 *  id:               <integer>,
 *  entity_id:        <integer>,
 *  document_id:      <integer>,
 *  tsc:              <date>,
 *  tsm:              <date>,
 *  uc:               <string>,
 *  um:               <string>
 * }
 *
 *
 * @author: Daniele Gazzelloni <daniele@danielegazzelloni.com>
 * @created: 04/11/2015
 ********************************************************************/
var Boom = require('boom');
var _ = require('lodash');

var db = require('./../lib/db');

/**
 * entity-document model
 */

var EntityDocumentModel = db.sequelize.define('entity_document', {
    id: {
      type: db.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    entity_id: {
      type: db.Sequelize.INTEGER,
      unique: 'entityDocumentUniqueConstraint'
    },
    document_id: {
      type: db.Sequelize.INTEGER,
      unique: 'entityDocumentUniqueConstraint'
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
exports.Schema = EntityDocumentModel;


/**
 * Get all entity_document records from our entity_document model. An array of entity_document is returned.
 *
 *
 * @param:    none.
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                  id:             <integer>,
 *                  entity_id:      <integer>,
 *                  document_id:    <integer>,
 *                  um:             <string>
 *                  uc:             <string>
 *                  tsc:            <date>
 *                  tsm:            <date>
 *                }]
 */
exports.getAllEntityDocument = function (data, callback) {
  var filter = {
    order: '"tsc" DESC'
  };
  EntityDocumentModel.findAll(filter).then(function (result) {
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
 * Get one entity_document from our entity_document model.
 * We expect id as parameter, eg. 'http://<hostname>/api/entity_document/12345'.
 * A single entity_document is returned (JSON).
 *
 *
 * @params:   id: <integer>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: {
 *                  id:             <integer>,
 *                  entity_id:      <integer>,
 *                  document_id:    <integer>,
 *                  um:             <string>
 *                  uc:             <string>
 *                  tsc:            <date>
 *                  tsm:            <date>
 *                     }
 */

exports.findById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid entityDocument'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {};
  filter.where = {id: data.id};
  EntityDocumentModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('EntityDocument not found'), null);
    }
    return callback(null, result.dataValues);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    callback(new Boom.notFound(error.message));
  });
};

exports.findByEntityId = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid entityDocument'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid entityId'));
  }

  var filter = {
    where : {entity_id: data.id}
  };
  EntityDocumentModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

exports.findAllDocumentIdByEntityId = function (data, callback) {
  var filter = {
    where : {entity_id: data.id},
    attributes: ['document_id']
  };
  EntityDocumentModel.findAll(filter).then(function (result) {
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
 * This method will update an entity_document model db record.
 *
 *
 * @param:        id:                <integer>
 *                document_id:       <integer>
 *                entity_id:           <integer>
 *                uc:                <string>
 *                um:                <string>
 *
 * @callback:     error:      <boolean>
 *                message:    <string>,
 *                results:    []
 */
exports.updateById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid entityDocument'));
  } else if (_.isEmpty(data.filter.id)) {
    return callback(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(data.updateData)) {
    return callback(new Boom.notFound('Invalid entityDocument'));
  }
  var filter = {where: {id: data.filter.id}};

  EntityDocumentModel.find(filter).then(function (entityDocument) {
    if (_.isEmpty(entityDocument)) {
      return callback(new Boom.notFound('EntityDocument not found'), null);
    }
    entityDocument.update(data.updateData, filter).then(function (result) {
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
 * This method will delete an entity_document record from the database.
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
    return callback(new Boom.notFound('Invalid entityDocument'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  EntityDocumentModel.find(filter).then(function (entityDocument) {
    if (_.isEmpty(entityDocument)) {
      return callback(new Boom.notFound('Invalid entityDocument'), null);
    }
    entityDocument.destroy().then(function () {
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
 * This method will delete all an entity_document record from the database for given entity_id.
 *
 *
 * @param:        entity_id:    <integer>
 *
 * @callback:     error:      <boolean>,
 *                message:    <string>,
 *                results:    []
 */
exports.deleteAllEntityDocumentByEntityId = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid entityDocument'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {entity_id: data.id}};
  EntityDocumentModel.find(filter).then(function (entityDocument) {
    if (_.isEmpty(entityDocument)) {
      return callback(new Boom.notFound('No document associated with entityId'), null);
    }
    EntityDocumentModel.destroy(filter).then(function () {
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
 * Parameter 'document_id', `entity_id` required, 'uc', `um` is instead optional
 *
 * This method will insert a new entity_document record into the database.
 *
 * @param:        document_id:      <integer>,
 *                entity_id:        <integer>
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
    return callback(new Boom.notFound('Invalid entityDocument'));
  }
  var newEntityDocument = data.newEntityDocument;
  if (_.isEmpty(newEntityDocument)) {
    return callback(new Boom.notFound('Invalid entityDocument'));
  } else if (isNaN(newEntityDocument.document_id) || newEntityDocument.document_id==='') {
    return callback(new Boom.notFound('Invalid documentId'));
  } else if (isNaN(newEntityDocument.entity_id) || newEntityDocument.entity_id==='') {
    return callback(new Boom.notFound('Invalid entityId'));
  }

  EntityDocumentModel.create(newEntityDocument).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};
