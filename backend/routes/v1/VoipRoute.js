'use strict';

var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer();

var VoipService = require('./../../services/VoipService');
var VoipController = require('./../../controllers/VoipController');

//!** Add new voip
router.post('/', upload.single('file'), [
  VoipService.validateVoipParams,
  VoipService.newVoip,
  VoipController.getNewVoip
]);

//!** Update voip
router.put('/', [
  VoipService.validateUpdateVoipParams,
  VoipService.updateById,
  VoipController.getUpdatedVoip
]);

module.exports = router;