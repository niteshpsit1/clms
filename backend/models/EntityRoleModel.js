'use strict';
var debug = require('debug')('LMS:EntityRoleModel');
/**
 * entity_role model, defined as following:
 *
 * entity_role: {
 *  id:         <integer>,
 *  name:       <string>,
 *  description:<string>,
 *  tsc:        <date>,
 *  tsm:        <date>,
 *  uc:         <date>,
 *  um:         <date>
 * }
 *
 * To manually insert an entity_role record into db type something like:
 *    insert into 'entity_roles' (name, description, tsc, tsm, uc, um) values ('Role 1', 'No description', '2015-10-27 18:32:15.923+00', '2015-10-27 18:32:15.923+00', 'admin', 'admin');
 *
 * @author: Daniele Gazzelloni <daniele@danielegazzelloni.com>
 * @created: 06/11/2015
 ********************************************************************/
var Boom = require('boom');
var _ = require('lodash');
var db = require('./../lib/db');

var EntityRoleModel = db.sequelize.define('entity_role', {

    id: {
      type: db.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: db.Sequelize.STRING,
      unique: true,
      allowNull: false
    },

    description: {
      type: db.Sequelize.STRING,
      allowNull: true
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

exports.Schema = EntityRoleModel;

/**
 * Get all entity_role records from our entity_role model. An array of entity_role is returned.
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
exports.getAllEntity = function (data, callback) {
  var filter = {
    order: '"tsc" DESC'
  };
  EntityRoleModel.findAll(filter).then(function (result) {
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
 * Get one entity_role from our entity_role model.
 * We expect id as parameter, eg. 'http://<hostname>/entity_roles/12345'.
 * A single entity_role is returned (JSON).
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
    return callback(new Boom.notFound('Invalid entityRole'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where:{id: data.id}};
  EntityRoleModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('EntityRole not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


exports.findByName = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid entityRole'));
  } else if (_.isEmpty(data.name)) {
    return callback(new Boom.notFound('Invalid name'));
  }

  var filter = {where:{name: data.name}};
  EntityRoleModel.findOne(filter).then(function (result) {
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
 * This method will update an entity_role model db record.
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
    return callback(new Boom.notFound('Invalid entityRole'));
  } else if (isNaN(data.filter.id) || _.isEmpty(data.filter.id)) {
    return callback(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(data.updateData)) {
    return callback(new Boom.notFound('Invalid entityRole'));
  }
  var filter = {where: {id: data.filter.id}};

  EntityRoleModel.find(filter).then(function (entityRole) {
    if (_.isEmpty(entityRole)) {
      return callback(new Boom.notFound('EntityRole not found'), null);
    }
    entityRole.update(data.updateData, filter).then(function (result) {
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
 * This method will delete an entity_role record from the database.
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
    return callback(new Boom.notFound('Invalid entityRole'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  EntityRoleModel.find(filter).then(function (entityRole) {
    if (_.isEmpty(entityRole)) {
      return callback(new Boom.notFound('Invalid entityRole'), null);
    }
    entityRole.destroy().then(function () {
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
 * Parameter 'name' required, 'description' is instead optional
 *
 * This method will insert a new entity_role record into the database.
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
    return callback(new Boom.notFound('Invalid entityRole'), null);
  }
  var newEntityRole = data.newEntityRole;
  if (_.isEmpty(newEntityRole)) {
    return callback(new Boom.notFound('Invalid entityRole'), null);
  } else if (_.isEmpty(newEntityRole.name)) {
    return callback(new Boom.notFound('Invalid name'), null);
  }

  EntityRoleModel.create(newEntityRole).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};