'use strict';

var express = require('express');
var router = express.Router();
var MessageService = require('./../../services/MessageService');
//var TokenService = require('./../../services/TokenService');
var MessageController = require('./../../controllers/MessageController');

//!** Get single message
router.get('/getMessage/:id', [
  MessageService.searchById,
  MessageController.getMessage
]);

//!** Get
router.post('/sendMail', [
  MessageService.sendMail
]);

module.exports = router;