'use strict';
var debug = require('debug')('LMS:MessageModel');
/**
 *
 *
 * message model, defined as following:
 *
 * loan_type: {
 *  id:             <integer>,
 *  content:        <string>,
 *  from:           <string>,
 *  to:             <string>,
 *  tsc:            <date>
 *  tsm:            <date>
 * }
 *
 * message.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 27/11/2015
 */

var Boom = require('boom');
var _ = require('lodash');
var nodemailer = require('nodemailer');

var PROCESS_ENV = process.env;
var db = require('./../lib/db');

var MessageModel = db.sequelize.define('message', {
    id: {
      type: db.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: db.Sequelize.STRING,
      allowNull: false
    },
    from: {
      type: db.Sequelize.INTEGER,
      allowNull: true
    },
    to: {
      type: db.Sequelize.INTEGER,
      allowNull: true
    }
  },
  {
    updatedAt: 'tsc',
    createdAt: 'tsm'
  });

exports.Schema = MessageModel;

/*************************************
 *
 *  mail configuration
 *
 **************************************/
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: PROCESS_ENV.LMS_EMAIL_CONFIG_EMAIL, //'andrew.korsak623@gmail.com',
    pass: PROCESS_ENV.LMS_EMAIL_CONFIG_PASSWORD //'monkeygame123`'
  }
});
/*********************************************************************
 *
 * insert method for socket
 *
 * @param
 *  content  : String,
 *  from     : Integer,
 *  to       : Integer
 *  callback : function (result)
 *
 ********************************************************************/

exports.insert = function (content, from, to, callback) {
  if (_.isEmpty(content)) {
    return callback(new Boom.notFound('Invalid content'), null);
  } else if (_.isEmpty(from)) {
    return callback(new Boom.notFound('Invalid fromEmail'), null);
  } else if (_.isEmpty(to)) {
    return callback(new Boom.notFound('Invalid toEmail'), null);
  }

  var newMessage = {
    content: content,
    from: from,
    to: to
  };

  MessageModel.create(newMessage).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

/**************************************************************************
 *
 *    get all message of specific user id
 *
 *    @param
 *      id   : Integer
 *     callback : function ( result , messages)
 *
 **************************************************************************/

exports.findById = function (data, callback) {
  if (isNaN(data.id) || data.id === '') {
    return callback(new Boom.notFound('Invalid id'), null);
  }
  var filter = {
    where: {
      $or: [{from: data.id}, {to: data.id}]
    }
  };
  MessageModel.findAll(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

/**************************************************************************
 *
 *    get all message of specific user id for socket use
 *
 *    @param
 *      userid   : Integer
 *     callback : function ( result , messages)
 *
 **************************************************************************/

exports.getMessages = function (userId, callback) {
  if (isNaN(userId) || userId === '') {
    return callback(new Boom.notFound('Invalid id'), null);
  }

  var filter = {
    where: {
      $or: [
        {from: userId},
        {to: userId}
      ]
    }
  };

  MessageModel.findAll(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

/**************************************************************************
 *
 *     get all messages for socket
 *
 **************************************************************************/

exports.getAllMessages = function (data, callback) {
  var filter = {
    order: 'tsc DESC'
  };
  MessageModel.findAll(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


exports.sendMail = function (data, callback) {
  if (_.isEmpty(data.mailOptions)) {
    return callback(new Boom.notFound('Invalid email details'), null);
  }
  transporter.sendMail(data.mailOptions, function (error, info) {
    if (!_.isEmpty(error)) {
      return callback(new Boom.notFound(error));
    }
    debug('mail sent : %o', info.response);
    return callback(null, info.response);
  });
};