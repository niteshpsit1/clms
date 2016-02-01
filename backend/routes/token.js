/**
 * token.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 23/01/2016
 */

var express       = require('express');
var router        = express.Router();

var Token   = require('../models/token');
var logger        = require('../logger');


// ROUTE: /api/token
// ==============================================

router.get('/', function (req, res) {

    logger.log(">", "GET token service called.");

    Token.getAll(req, function (statusCode, error, message, result) {
        res.status(statusCode).json({ error: error, message: message, result: result });
    });

});

router.get('/email/:email', function (req, res) {

    logger.log(">", "GET token by email service called.");

    Token.getOneByEmail(req, function (statusCode, error, message, result) {
        res.status(statusCode).json({ error: error, message: message, result: result });
    });

});

router.get('/:id', function (req, res) {

    logger.log(">", "GET token by id service called.");

    Token.getOne(req, function (statusCode, error, message, result) {
        res.status(statusCode).json({ error: error, message: message, result: result });
    });

});


router.put('/', function (req, res) {

    logger.log(">", "PUT token service called.");

    Token.edit(req, function (statusCode, error, message, result) {
        res.status(statusCode).json({ error: error, message: message, result: result });
    });

});


router.delete('/', function (req, res) {

    logger.log(">", "DELETE token service called.");

    Token.delete(req, function (statusCode, error, message, result) {
        res.status(statusCode).json({ error: error, message: message, result: result });
    });

});


router.post('/', function (req, res) {

    logger.log(">", "POST token service called.");

    Token.insert(req, function (statusCode, error, message, result) {
        res.status(statusCode).json({ error: error, message: message, result: result });
    });

});

module.exports = router;