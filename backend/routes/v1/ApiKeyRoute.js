'use strict';

var express = require('express');
var router = express.Router();

var ApiKeyService = require('./../../services/ApiKeyService');

//!** Get all ApiKey
router.get('/', [
  ApiKeyService.getApiKey
]);

//!** Add new ApiKey
router.post('/', [
  ApiKeyService.addApiKey
]);

module.exports = router;