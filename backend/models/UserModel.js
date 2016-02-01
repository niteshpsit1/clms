'use strict';
var debug = require('debug')('LMS:UserModel');
/*
 * User model, defined as following:
 *
 * UserModel: [{
 *  id:         <integer>,
 *  name:       <string>,
 *  age:        <int>,
 *  email:      <string>,
 *  password:   <string>,
 *  data:       <json>
 *  tsc:        <timestamp>,
 *  tsm:        <timestamp>
 * }]
 *
 *
 * @author: Daniele Gazzelloni <daniele@danielegazzelloni.com>
 ********************************************************************/
var Boom = require('boom');
var _ = require('lodash');

var db = require('./../lib/db');

var UserModel = db.sequelize.define('user', {

    id: {
      type: db.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: db.Sequelize.STRING,
      allowNull: false
    },

    age: {
      type: db.Sequelize.INTEGER,
      allowNull: false
    },

    email: {
      type: db.Sequelize.STRING,
      allowNull: false,
      unique: true,
      required: true,
      validation: {
        isEmail: true
      }
    },

    password: {
      type: db.Sequelize.STRING,
      allowNull: false
      //set: function (v) {
      //    var salt = bcrypt.genSaltSync(15);
      //    var hash = bcrypt.hashSync(v, salt);
      //    this.setDataValue('password', hash);
      //}
    },

    data: {
      type: db.Sequelize.JSONB
    }

  }, {
    //indexes: [
    //    {
    //        name: 'email_index',
    //        method: 'BTREE',
    //        fields: ['email']
    //    }
    //],
    instanceMethods: {
      toJSON: function () {
        var values = this.get();
        delete values.password;
        return values;
      }
    },
    updatedAt: 'tsc',
    createdAt: 'tsm'
  }
);
exports.Schema = UserModel;
/**
 * Get all UserModel from our UserModel model.
 * We optionally expect an id as query parameter, eg. http://<hostname>/UserModel?id=12345.
 * If an id is provided a single user is returned (JSON), otherwise an array of UserModel is returned.
 *
 * @param:    id: <int>
 *
 * @callback: error: boolean,
 *            message: string,
 *            result: { name: string, age: int, email: string, password: string, tsc: DATE, tsm: DATE }
 *
 *            error: boolean,
 *            message: string,
 *            results: [{ name: string, age: int, email: string, password: string, tsc: DATE, tsm: DATE }]
 */
exports.getAllUser = function (data, callback) {
  var filter = {
    order: '"tsc" DESC'
  };

  UserModel.findAll(filter).then(function (result) {
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
 * Get one UserModel from our UserModel model.
 * We expect an id as parameter, eg. 'http://<hostname>/UserModel/12345'.
 * If an id is provided a single user is returned (JSON), otherwise an array of UserModel is returned.
 *
 * @params:    id: <int>
 *
 * @callback: error: boolean,
 *            message: string,
 *            result: { }
 */
exports.findById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid User'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {};
  filter.where = {id: data.id};
  UserModel.findOne(filter).then(function (result) {
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
 * We expect req.body.id as parameter, as well as ALL the other parameters like
 * user's name, email and age. This method will update the db entry in UserModel model
 * identified with the 'id' parameter.
 *
 * @callback:     error: boolean,
 *                message: string,
 *                results: []
 */
exports.updateById = function (data, callback) {
   if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid user'));
  } else if (_.isEmpty(data.filter.id)) {
    return callback(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(data.updateData)) {
    return callback(new Boom.notFound('Invalid user'));
  }
  var filter = {where: {id: data.filter.id}};
  UserModel.find(filter).then(function (user) {
    if (_.isEmpty(user)) {
      return callback(new Boom.notFound('User not found'), null);
    }
    user.update(data.updateData, filter).then(function (result) {
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
 * We expect req.body.id as parameter. This method will delete the db entry in UserModel model
 * identified with the 'id' parameter.
 *
 * @callback:     error: boolean,
 *                message: string,
 *                results: []
 */
exports.deleteById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid user'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  UserModel.find(filter).then(function (user) {
    if (_.isEmpty(user)) {
      return callback(new Boom.notFound('Invalid user'), null);
    }
    user.destroy().then(function () {
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
 * We expect all the user parameters in req.body like name, email and age, with
 * req.body.id as optional.
 * This method will insert a new record into the database returning.
 *
 * @callback:     error: boolean
 *                message: string,
 *                results: []
 */
exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid User'));
  }
  var newUser = data.newUser;
  if (_.isEmpty(newUser)) {
    return callback(new Boom.notFound('Invalid user detail'));
  } else if (_.isEmpty(newUser.name)) {
    return callback(new Boom.notFound('Invalid name'));
  } else if (isNaN(newUser.age)) {
    return callback(new Boom.notFound('Invalid age'));
  } else if (_.isEmpty(newUser.email)) {
    return callback(new Boom.notFound('Invalid email'));
  } else if (_.isEmpty(newUser.password)) {
    return callback(new Boom.notFound('Invalid password'));
  }

  UserModel.create(newUser).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    } else if (!_.isEmpty(result) && !_.isEmpty(result.dataValues)) {
      delete result.dataValues.password;
    }
    return callback(null, result.dataValues);
  }).catch(function (error) {
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
  filter.where = {email: search.email};
  UserModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

exports.findByFilter = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid search detail'));
  }
  var search = data;
  if (_.isEmpty(search.filter)) {
    return callback(new Boom.notFound('Invalid filter'));
  }
  var filter = search.filter;
  UserModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};