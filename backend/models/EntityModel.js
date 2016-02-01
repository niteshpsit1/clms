'use strict';
var debug = require('debug')('LMS:EntityModel');
/**
 * entity model, defined as following:
 *
 * entity: {
 *  id:         <integer>, (Text, ID number, or Passport, or Tax ID)
 *  idnumber:   <string>,
 *  name:       <string>,
 *  dba:        <string>,
 *  individual: <boolean>,
 *  data:       <json>,
 *  tsc:        <date>,
 *  tsm:        <date>,
 *  uc:         <date>,
 *  um:         <date>
 * }
 *
 *
 * @author: Daniele Gazzelloni <daniele@danielegazzelloni.com>
 * @created: 15/10/2015
 ********************************************************************/

var _ = require('lodash');
var Boom = require('boom');
var db = require('./../lib/db');

/**
 * entity model
 */
var EntityModel = db.sequelize.define('entity', {

  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  idnumber: {
    type: db.Sequelize.STRING,
    allowNull: false
  },

  name: {
    type: db.Sequelize.STRING,
    allowNull: false
  },

  dba: {
    type: db.Sequelize.STRING,
    allowNull: false
  },

  individual: {
    type: db.Sequelize.BOOLEAN,
    allowNull: false,
    isBoolean: {
      errorMessage: 'individual is not boolean'
    }
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
  indexes: [
    {
      name: 'entity_idnumber_index',
      method: 'BTREE',
      fields: ['idnumber']
    }
  ],
  updatedAt: 'tsc',
  createdAt: 'tsm'
});

exports.Schema = EntityModel;
/**
 * Get one entity from our entity model.
 * We expect id as parameter, eg. 'http://<hostname>/entities/12345'.
 * A single entity is returned (JSON).
 *
 *
 * @params:   id: <integer>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: {
 *                         id: integer,
 *                         idnumber: string,
 *                         name: string,
 *                         dba: string,
 *                         individual: boolean,
 *                         data: json,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                     }
 */

exports.findById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid entity'));
  } else if (isNaN(data.id) || _.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }
  var filter = {where: {id: data.id}};

  EntityModel.findOne(filter).then(function (result) {
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
 * Get all entities from our entity model.
 *
 * An array of entities is returned.
 *
 *
 * @param:    none.
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: [{
 *                         id: integer,
 *                         idnumber: string,
 *                         name: string,
 *                         dba: string,
 *                         individual: boolean,
 *                         data: json,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                     }]
 */
exports.getAllEntity = function (req, callback) {
  var filter = {
    order: '"tsc" DESC'
  };

  EntityModel.findAll(filter).then(function (result) {
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
 * This method will update an entity model db record.
 *
 *
 * @param:        id:   <integer>,
 *                idnumber:   <string>,
 *                name:       <string>,
 *                dba:        <string>,
 *                individual: <boolean>,
 *                data:       <JSON>
 *
 * @callback:     error:      <boolean>
 *                message:    <string>,
 *                results:    []
 */
exports.updateById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid entity'));
  } else if (isNaN(data.filter.id) || _.isEmpty(data.filter.id)) {
    return callback(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(data.updateData)) {
    return callback(new Boom.notFound('Invalid entity'));
  }

  var filter = {where: {id: data.filter.id}};

  EntityModel.find(filter).then(function (entity) {
    if (_.isEmpty(entity)) {
      return callback(new Boom.notFound('Entity not found'), null);
    }
    entity.update(data.updateData, filter).then(function (result) {
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
 * This method will delete an entity record from the database.
 *
 *
 * @param:        id:   <integer>
 *
 * @callback:     error:      <boolean>,
 *                message:    <string>,
 *                results:    []
 */
exports.deleteById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid entity'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid entityId'));
  }

  var filter = {where: {id: data.id}};
  EntityModel.find(filter).then(function (entity) {
    if (_.isEmpty(entity)) {
      return callback(null, null);
    }
    entity.destroy().then(function () {
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
 * All parameters required except for data (which is the JSON optional data)
 *
 * This method will insert a new entity record into the database.
 *
 * @param:        idnumber:   <string>,
 *                name:       <string>,
 *                dba:        <string>,
 *                individual: <boolean>,
 *                data:       <JSON>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid Entity'), null);
  }
  var newEntity1 = data.newEntity1;
  var newEntity2 = data.newEntity2;
  if (_.isEmpty(newEntity1)) {
    return callback(new Boom.notFound('Invalid entity detail'), null);
  }

  db.sequelize.transaction(function (t) {

    if (newEntity1.individual === 'true') {
      return EntityModel.create(newEntity1, {transaction: t});
    } else {
      return EntityModel.create(newEntity2, {transaction: t}).then(function (resNewEntity1) {
        newEntity1.data.company_id = resNewEntity1.dataValues.id;
        return EntityModel.create(newEntity1, {transaction: t}).then(function () {
          return resNewEntity1;
        });
      });
    }

  }).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });

};


exports.findByEmail = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid search detail'));
  }
  var search = data;
  if (_.isEmpty(search.email)) {
    return callback(new Boom.notFound('Invalid email'));
  }
  var filter = {};
  filter.where = {data: {email: search.email}};
  EntityModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};
