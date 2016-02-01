'use strict';

var express = require('express');
var router = express.Router();

var DownloadService = require('./../../services/DownloadService');

//!** Download Document
router.get('/download/:name', [
  DownloadService.downloadDocument
]);

module.exports = router;