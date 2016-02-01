'use strict';
var debug = require('debug')('LMS:DB');
/**
 * ORM core & initialization for PostgreSQL.
 *
 *
 * @author: Daniele Gazzelloni <daniele@danielegazzelloni.com>
 ********************************************************************/
var Sequelize = require('sequelize');
var config = require('./../../config/backend.config.js');
var Promise = require('bluebird');

// ORM connection settings
var sequelize = new Sequelize(config.db.pgDatabase, config.db.pgUser, config.db.pgPass, {

  // hostname settings
  host: config.db.pgHost,
  port: config.db.pgPort,

  // dialect to use
  dialect: 'postgres',

  // pool settings
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },

  // Disable logging (default: console.log)
  logging: false,

  define: {

    syncOnAssociation: true,
    underscored: true,
    // We will manage timestamp columns by ourselves by custom fields
    timestamps: true,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  }

});

/**
 * Connects to PostgreSQL showing an error if failing.
 */
exports.init = function () {

  return new Promise(function (resolve, reject) {
    return sequelize.authenticate()
      .then(function () {
        debug('PostgreSQL: db initialized.');
        // {force: true}
        return sequelize.sync().then(function () {
          debug('PostgreSQL: db synced.');
          resolve();
        }).catch(function (error) {
          debug('PostgreSQL: unable to sync to the database: ' + error.message);
          reject(error);
        });
      }).catch(function (error) {
        reject(error);
      });
  });

};

exports.sequelize = sequelize;
exports.Sequelize = Sequelize;