'use strict';
/**
 * phoneHooks.js
 * Routing for phone system Webhook.
 *
 * @author Daniele Gazzelloni <daniele@danielegazzelloni.com>
 * @created 30/10/2015
 */
var debug = require('debug')('LMS:PhoneHooks');
var express = require('express');
var router = express.Router();

var PhoneHook = require('../models/phoneHook');

// ROUTE: /hooks/phoneHooks
// ==============================================

router.post('/', function (req, res) {
  debug('POST phoneHook service called.');
  PhoneHook.forward(req, function (statusCode, error, message, result) {
    res.status(statusCode).json({error: error, message: message, result: result});
  });
});

module.exports = router;