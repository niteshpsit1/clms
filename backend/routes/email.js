/**
 * email.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 23/01/2016
 */

var express       = require('express');
var router        = express.Router();

var Email   = require('../models/email');
var logger        = require('../logger');


// ROUTE: /api/email
// ==============================================

router.get('/', function (req, res) {

    logger.log(">", "GET email service called.");

    Email.getAll(req, function (statusCode, error, message, result) {
        res.status(statusCode).json({ error: error, message: message, result: result });
    });

});

router.get('/sender/:email', function (req, res) {

    logger.log(">", "GET all sender email by email service called.");

    Email.getAllBySenderEmail(req, function (statusCode, error, message, result) {
        res.status(statusCode).json({ error: error, message: message, result: result });
    });

});

router.get('/:id', function (req, res) {

    logger.log(">", "GET email by id service called.");

    Email.getOne(req, function (statusCode, error, message, result) {
        res.status(statusCode).json({ error: error, message: message, result: result });
    });

});


router.put('/', function (req, res) {

    logger.log(">", "PUT email service called.");

    Email.edit(req, function (statusCode, error, message, result) {
        res.status(statusCode).json({ error: error, message: message, result: result });
    });

});


router.delete('/', function (req, res) {

    logger.log(">", "DELETE email service called.");

    Email.delete(req, function (statusCode, error, message, result) {
        res.status(statusCode).json({ error: error, message: message, result: result });
    });

});


router.post('/', function (req, res) {

    logger.log(">", "POST email service called.");

    Email.insert(req, function (statusCode, error, message, result) {
        res.status(statusCode).json({ error: error, message: message, result: result });
    });

});

module.exports = router;