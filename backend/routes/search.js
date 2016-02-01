/**
 * search.js
 * Default description.
 *
 * @author Nitesh Jatav <nitesh.jatav@daffodilsw.com>
 * @created 14/1/2016
 */
var express       = require('express');
var router        = express.Router();

var Search     = require('../models/search');
var logger        = require('../logger');

// ROUTE: /api/search
// ==============================================

router.get('/', function (req, res) {

    logger.log(">", "GET search service called.");

    Search.getList(req, function (statusCode, error, message, result) {
        res.status(statusCode).json({ error: error, message: message, result: result });
    });

});

module.exports = router;