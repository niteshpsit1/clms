'use strict';
var debug = require('debug')('LMS:phoneHook');
/**
 * PhoneHook data model, defined as following:
 *
 * PhoneHook: {
 *  id:           <integer>,
 *  url:          <url>,
 *  event:        <string>,
 *  data:         <json>,
 *  tsc:          <date>,
 *  tsm:          <date>
 * }
 *
 * Basically, the pair url/event defines the action to send data to.
 * e.g.: {
 *     url: '/api/testModel1',
 *     event: 'OFF',
 *     data: { call: 'disconnected', callCode: 123456 }
 *  }
 *
 * @author: Daniele Gazzelloni <daniele@danielegazzelloni.com>
 * @created: 30/10/2015
 ********************************************************************/

var util = require('util');
var request = require('request');
var fs = require('fs');
var db = require('./../lib/db');
var config = require('./../../config/backend.config');
var PhoneHook = require('./models').PhoneHook;

/**
 * PhoneHook model
 */

/*var PhoneHook = db.sequelize.define('PhoneHook', {

 id: {
 type: db.Sequelize.INTEGER,
 primaryKey: true,
 autoIncrement: true
 },

 url: {
 type: db.Sequelize.STRING,
 allowNull: false
 },

 event: {
 type: db.Sequelize.STRING,
 allowNull: false
 },

 data: {
 type: db.Sequelize.JSON
 }
 }, {
 updatedAt: 'tsc', // created
 createdAt: 'tsm'  // modified
 });


 // Create our PhoneHook relation on DB if it doesn't exist
 //PhoneHook.sync();


 exports.PhoneHook = PhoneHook;*/


/**
 * All parameters required.
 *
 * Event is the event name sent from the Phone System.
 *
 * @param:        url:    <string>,
 *                event:  <string>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.forward = function (req, callback) {

  req.checkBody({
    'url': {
      notEmpty: true,
      errorMessage: 'Invalid API url'
    },
    'event': {
      notEmpty: true,
      errorMessage: 'Invalid event'
    }
  });


  var errors = req.validationErrors();
  if (errors) {
    return callback(400, true, util.inspect(errors), []);
  } else {

    var fullurl = req.protocol + '://' + req.get('host') + req.body.url;
    var filter = {url: req.body.url, event: req.body.event};

    PhoneHook.findOne(filter)
      .then(function (result) {
        request.post({url: fullurl, form: result.dataValues.data}, function (error, response, body) {
          var result = JSON.parse(body);
          callback(response.statusCode, result.error, result.message, result.result);
        });
      })
      .error(function (error) {
        debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
        callback(500, true, error.message, []);
      });
  }
};