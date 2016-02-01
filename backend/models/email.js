/**
 *
 * Email model, defined as following:
 *
 * Email: {
 *  id:         <integer>,
 *  sender:     <string>,
 *  data:       <json>,
 *  um:         <string>
 *  uc:         <string>
 *  tsc:        <date>
 *  tsm:        <date>
 * }
 *
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 23/01/2016
 */

var util = require('util');
var _ = require('lodash');
var db = require("./../db");
var logger = require("./../logger");
var Email = require('./models').Email;

/**
 * Email model
 */

/*var Email = db.sequelize.define('Email', {

    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sender: {
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

exports.Email = Email;*/



/**
 * Get one Email from our Email model.
 * We expect id as parameter, eg. "http://<hostname>/api/email/12345".
 * A single Email is returned (JSON).
 *
 *
 * @params:   id: <integer>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: {
 *                         id: integer,
 *                         sender: string,
 *                         data: json,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                     }
 */

exports.getOne = function (req, callback) {

    req.checkParams({
        'id': {
            notEmpty: true,
            isNumeric: {
                errorMessage: 'id is not number'
            },
            errorMessage: 'Invalid id'
        }
    });

    var errors = req.validationErrors();
    if (errors) {
        return callback(400, true, util.inspect(errors), []);
    }

    // Filter by a single Email
    var filter = {
        where: {
            id: parseInt(req.params.id)
        }
    };

    Email.findOne(filter)
        .then(function (result) {
            callback(200, false, "OK", result);
        })
        .error( function(error) {
            logger.log("*", "PostgreSQL: "+error.message+" - Are we still connected to database?");
            callback(500, true, error.message, []);
        });

};


/**
 * Get all Email from our Email model by sender email.
 * We expect sender email as parameter, eg. "http://<hostname>/api/email/sender/:sender".
 *
 *
 *
 * @params:   email: <string>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: [{
 *                         id: integer,
 *                         sender: string,
 *                         data: json,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                     }]
 */

exports.getAllBySenderEmail = function (req, callback) {

    req.checkParams({
        'sender': {
            notEmpty: true,
            isEmail: {
                errorMessage: 'sender is not valid email'
            },
            errorMessage: 'Invalid sender'
        }
    });

    var errors = req.validationErrors();
    if (errors) {
        return callback(400, true, util.inspect(errors), []);
    }

    // Filter by a single key
    var filter = {
        where: {
            sender: req.params.sender
        }
    };

    Email.findAll(filter)
        .then(function (result) {
            callback(200, false, "OK", result);
        })
        .error( function(error) {
            logger.log("*", "PostgreSQL: "+error.message+" - Are we still connected to database?");
            callback(500, true, error.message, []);
        });

};



/**
 * Get all Email records from our Email model. An array of Email is returned.
 *
 *
 * @param:    none.
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                         id: integer,
 *                         sender: string,
 *                         data: json,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                       }]
 */
exports.getAll = function (req, callback) {

    // Select all Email records
    var filter = {
        order: '"tsc" DESC'
    };

    Email.findAll(filter)
        .then(function (results) {
            callback(200, false, "OK", results);
        })
        .error( function(error) {
            logger.log("*", "PostgreSQL: "+error.message+" - Are we still connected to database?");
            callback(500, true, error.message, []);
        });

};





/**
 * We expect id as parameter, all the other parameters are instead optional.
 * This method will update an Email model db record.
 *
 *
 * @param:        id:       <integer>,
 *                sender:   <string>,
 *                data:     <json>
 *
 * @callback:     error:      <boolean>
 *                message:    <string>,
 *                results:    []
 */
exports.edit = function (req, callback) {


    req.checkBody({
        'id': {
            notEmpty: true,
            isNumeric: {
                errorMessage: 'id is not number'
            },
            errorMessage: 'Invalid id'
        },
        'sender': {
            optional: true,
            isEmail: {
                errorMessage: 'sender is not valid Email'
            },
            errorMessage: 'Invalid sender'
        },
        'data': {
            optional: true,
            //isJSON: {
            //    errorMessage: 'Invalid data json'
            //},
            errorMessage: 'Invalid data'
        }
    });


    var errors = req.validationErrors();
    if (errors) {
        return callback(400, true, util.inspect(errors), []);
    } else {

        // Parameters to update
        var updatedEmail = {};

        if(req.body.sender){
            updatedEmail['sender'] =  req.body.sender;
        }

        updatedEmail['um'] = req.user.id || '';


        // We will grab the id from req.body in the following lines...
        var filter = { where: { id: parseInt(req.body.id) } };

        Email.findOne(filter)
            .then(function (result) {
                if (result) {
                    if(req.body.data){
                        updatedEmail['data'] = _.merge({}, result.data, req.body.data);
                    }

                    result.updateAttributes(updatedEmail).then(function (updated) {
                        callback(200, false, "OK", updated);
                    });
                } else {
                    callback(404, true, "Email not found", []);
                }
            })
            .error( function(error) {
                logger.log("*", "PostgreSQL: "+error.message+" - Are we still connected to database?");
                callback(500, true, error.message, []);
            });

    }

};



/**
 * Required id.
 *
 * This method will delete an Email record from the database.
 *
 *
 * @param:        id:         <integer>
 *
 * @callback:     error:      <boolean>,
 *                message:    <string>,
 *                results:    []
 */
exports.delete = function (req, callback) {

    req.checkBody({
        'id': {
            notEmpty: true,
            errorMessage: 'Invalid id'
        }
    });

    var errors = req.validationErrors();
    if (errors) {
        return callback(400, true, util.inspect(errors), []);
    } else {

        var filter = { where: { id: parseInt(req.body.id) } };

        Email.find(filter)
            .then(function (result) {
                if (result) {
                    result.destroy().then(function () {
                        callback(200, false, "OK", []);
                    });
                } else {
                    callback(404, true, "Email not found", []);
                }
            })
            .error( function(error) {
                logger.log("*", "PostgreSQL: "+error.message+" - Are we still connected to database?");
                callback(500, true, error.message, []);
            });

    }

};




/**
 * Parameter 'sender', `data` required
 *
 * This method will insert a new Email record into the database.
 *
 * @param:        sender:    <string>,
 *                data:      <json>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.insert = function (req, callback) {

    req.checkBody({
        'sender': {
            notEmpty: true,
            errorMessage: 'Invalid code'
        },
        'data': {
            notEmpty: true,
            //isJSON: {
            //    errorMessage: 'Invalid json data'
            //},
            errorMessage: 'Invalid data'
        }
    });


    var errors = req.validationErrors();
    if (errors) {
        return callback(400, true, util.inspect(errors), []);
    } else {

        var email = {};

        email.sender       = req.body.sender;
        email.data = req.body.data;

        email['uc'] = req.user.id || '';
        email['um'] =  req.user.id || '';


        Email.create(email)
            .then(function (result) {
                callback(201, false, "OK", result);
            })
            .error( function(error) {
                logger.log("*", "PostgreSQL: "+error.message+" - Are we still connected to database?");
                callback(500, true, error.message, []);
            });

    }

};
