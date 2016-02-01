/**
 *
 * token model, defined as following:
 *
 * token: {
 *  id:         <integer>,
 *  key:        <string>,
 *  tag:        <string>,
 *  data:       <json>,
 *  um:         <string>
 *  uc:         <string>
 *  tsc:        <date>
 *  tsm:        <date>
 * }
 *
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 24/01/2016
 */

var util          = require('util');
var _             = require('lodash');
var db      = require("./../db");
var logger        = require("./../logger");
var Token=                require('./models').Token;

/**
 * Token model
 */

/*var Token = db.sequelize.define('token', {

    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: db.Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: { msg: 'Invalid email.' }
        }
    },
    tag: {
        type: db.Sequelize.STRING
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

exports.Token = Token;*/



/**
 * Get one token from our token model.
 * We expect id as parameter, eg. "http://<hostname>/api/token/12345".
 * A single token is returned (JSON).
 *
 *
 * @params:   id: <integer>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: {
 *                         id: integer,
 *                         key: string,
 *                         tag: string,
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

    // Filter by a single token
    var filter = {
        where: {
            id: parseInt(req.params.id)
        }
    };

    Token.findOne(filter)
        .then(function (result) {
            callback(200, false, "OK", result);
        })
        .error( function(error) {
            logger.log("*", "PostgreSQL: "+error.message+" - Are we still connected to database?");
            callback(500, true, error.message, []);
        });

};


/**
 * Get one token from our token model.
 * We expect id as parameter, eg. "http://<hostname>/api/token/email/emailAddress".
 * A single token is returned (JSON).
 *
 *
 * @params:   email: <string>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: {
 *                         id: integer,
 *                         key: string,
 *                         tag: string,
 *                         data: json,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                     }
 */

exports.getOneByEmail = function (req, callback) {

    req.checkParams({
        'email': {
            notEmpty: true,
            isEmail: {
                errorMessage: 'email is not valid'
            },
            errorMessage: 'Invalid email'
        }
    });

    var errors = req.validationErrors();
    if (errors) {
        return callback(400, true, util.inspect(errors), []);
    }

    // Filter by a single key
    var filter = {
        where: {
            key: req.params.email
        }
    };

    Token.findOne(filter)
        .then(function (result) {
            callback(200, false, "OK", result);
        })
        .error( function(error) {
            logger.log("*", "PostgreSQL: "+error.message+" - Are we still connected to database?");
            callback(500, true, error.message, []);
        });

};



/**
 * Get all token records from our token model. An array of token is returned.
 *
 *
 * @param:    none.
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                         id: integer,
 *                         key: string,
 *                         tag: string,
 *                         data: json,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                       }]
 */
exports.getAll = function (req, callback) {

    // Select all token records
    var filter = {
        order: '"tsc" DESC'
    };

    Token.findAll(filter)
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
 * This method will update an token model db record.
 *
 *
 * @param:        id:       <integer>,
 *                key:      <string>,
 *                tag:      <string>
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
        'key': {
            optional: true,
            isEmail: {
                errorMessage: 'key is not valid email'
            },
            errorMessage: 'Invalid key'
        },
        'tag': {
            optional: true,
            errorMessage: 'Invalid description'
        },
        'data': {
            optional: true,
            //isJSON: {
            //    errorMessage: 'Invalid json'
            //},
            errorMessage: 'Invalid data'
        }
    });


    var errors = req.validationErrors();
    if (errors) {
        return callback(400, true, util.inspect(errors), []);
    } else {

        // Parameters to update
        var updatedToken = {};

        if(req.body.key){
            updatedToken['key'] =  req.body.key;
        }
        if(req.body.tag){
            updatedToken['tag'] =  req.body.tag;
        }

        updatedToken['um'] = req.user.id || '';


        // We will grab the id from req.body in the following lines...
        var filter = { where: { id: parseInt(req.body.id) } };

        Token.findOne(filter)
            .then(function (result) {
                console.log("RESULT",result);
                if (result) {
                    if(req.body.data){
                        updatedToken['data'] = _.merge({}, result.data, req.body.data);
                    }

                    result.updateAttributes(updatedToken).then(function (updated) {
                        callback(200, false, "OK", updated);
                    });
                } else {
                    callback(404, true, "token not found", []);
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
 * This method will delete an token record from the database.
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

        Token.find(filter)
            .then(function (result) {
                if (result) {
                    result.destroy().then(function () {
                        callback(200, false, "OK", []);
                    });
                } else {
                    callback(404, true, "token not found", []);
                }
            })
            .error( function(error) {
                logger.log("*", "PostgreSQL: "+error.message+" - Are we still connected to database?");
                callback(500, true, error.message, []);
            });

    }

};




/**
 * Parameter 'tag', 'key', `data` required
 *
 * This method will insert a new token record into the database.
 *
 * @param:        key:       <string>,
 *                tag:       <string>
 *                data:      <json>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.insert = function (req, callback) {

    req.checkBody({
        'key': {
            notEmpty: true,
            errorMessage: 'Invalid code'
        },
        'tag': {
            notEmpty: true,
            errorMessage: 'Invalid description'
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

        var token = {};

        token.key       = req.body.key;
        token.tag       = req.body.tag;
        token.data = req.body.data;

        token['uc'] = req.user.id || '';
        token['um'] =  req.user.id || '';


        Token.create(token)
            .then(function (result) {
                callback(201, false, "OK", result);
            })
            .error( function(error) {
                logger.log("*", "PostgreSQL: "+error.message+" - Are we still connected to database?");
                callback(500, true, error.message, []);
            });

    }

};
