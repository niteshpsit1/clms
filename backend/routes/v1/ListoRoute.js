'use strict';
var debug = require('debug')('LMS:ListoRoute');
/**
 * ListoRoute.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 30/11/2015
 */

var express = require('express');
var router = express.Router();

var ListoService = require('./../../services/ListoService');
var ListoController = require('./../../controllers/ListoController');
var TokenService = require('./../../services/TokenService');

//!** Add new loan
router.post('/listo', [
  TokenService.validateToken,
  ListoService.GetAllWebHook,
  ListoController.getListo
]);

//!** Add new loan
router.post('/', [
  TokenService.validateToken,
  ListoService.AddListoCred,
  ListoController.getNewListo
]);

module.exports = router;
