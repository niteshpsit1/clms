'use strict';
var debug = require('debug')('LMS:VoipModel');
/**
 * voip.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 12/11/2015
 */

var _ = require('lodash');
var Boom = require('boom');

//var uuidBase62 = require('uuid-base62');
var mime = require('mime');
//var fs = require('fs');
var shortid = require('shortid');
var util = require('util');
var db = require('./../lib/db');
var config = require('./../../config/backend.config');
var awsHelper = require('./../lib/helpers/aws');
var S3Async = awsHelper.S3Async;
var s3 = awsHelper.s3;

var VoipModel = db.sequelize.define('voip', {

  uniqueid: {
    type: db.Sequelize.STRING,
    primaryKey: true
  },
  billsec: {
    type: db.Sequelize.INTEGER
  },
  src: {
    type: db.Sequelize.STRING
  },
  dst: {
    type: db.Sequelize.STRING
  },
  calldate: {
    type: db.Sequelize.DATE
  },
  file: {
    type: db.Sequelize.STRING
  },
  disposition: {
    type: db.Sequelize.STRING
  },
  status: {
    type: db.Sequelize.STRING
  },
  text: {
    type: db.Sequelize.TEXT
  }
}, {
  updatedAt: 'tsc',
  createdAt: 'tsm'
});

exports.Schema = VoipModel;


/**
 * We expect id as parameter, all the other parameters are instead optional.
 * This method will update voip model db record.
 *
 *
 * @param:        uniqueid:  <string>,
 *                src:       <string>,
 *                dst:       <string>,
 *                status:    <string>
 *
 * @callback:     error:      <boolean>
 *                message:    <string>,
 *                results:    []
 */
exports.updateById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid voip'));
  } else if (_.isEmpty(data.filter.uniqueid)) {
    return callback(new Boom.notFound('Invalid uniqueid'));
  } else if (_.isEmpty(data.updateData)) {
    return callback(new Boom.notFound('Invalid voip'));
  }
  var filter = {where: {uniqueid: data.filter.uniqueid}};

  VoipModel.find(filter).then(function (voip) {
    console.log(voip);
    if (_.isEmpty(voip)) {
      return callback(new Boom.notFound('Voip not found'), null);
    }
    voip.update(data.updateData, filter).then(function (result) {
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
 * All parameters required except txt, file.
 * This method will insert a new History record into the database.
 *
 * @param:
 *                uniqueid: <string>, (optional) otherwise shortId
 *                src:      <string>,
 *                dst:      <string>,
 *                calldate: <date>,
 *                file:     <string>
 *                disposition: <string>
 *                status    <string>
 *                text:     <string>
 *
 * This method will insert a new apiKey record into the database.
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid voip'), null);
  } else if (_.isEmpty(data.newVoip)) {
    return callback(new Boom.notFound('Invalid voip'), null);
  }

  var newVoip = data.newVoip;
  if (_.isEmpty(data.file)) {
    VoipModel.create(newVoip).then(function (result) {
      if (_.isEmpty(result)) {
        return callback(null, null);
      }
      return callback(null, result.dataValues);
    }).catch(function (error) {
      debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
      return callback(new Boom.notFound(error.message));
    });
  }
  else {
    try {
      var file = data.file;
      var originalname = file.originalname;
      originalname = originalname.trim();
      originalname = originalname.replace(/\s+/g, '-').toLowerCase();
      var fileName = shortid.generate() + '-' + originalname;

      S3Async.putObjectAsync({
        ACL: 'private',
        Bucket: config.aws.s3Bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: mime.lookup(file.originalname)
      }).then(function () {

        newVoip.file = file.originalname;

        VoipModel.create(newVoip).then(function (result) {
          if (_.isEmpty(result)) {
            return callback(null, null);
          }
          return callback(null, result.dataValues);
        }).catch(function (error) {
          debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
          return callback(new Boom.notFound(error.message));
        });
      });
    } catch (error) {
      debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
      return callback(new Boom.notFound(error.message));
    }
  }
};

exports.recording = function (req, res) {
  req.checkParams({
    'id': {
      notEmpty: true,
      errorMessage: 'Invalid recording id'
    }
  });

  var errors = req.validationErrors();
  if (errors) {
    res.status(400).json({error: true, message: util.inspect(errors), result: []});
  }

  var recStream = s3.getObject({
    Bucket: config.aws.s3Bucket,
    Key: req.params.id
  }).createReadStream();

  recStream.pipe(res);
};


