'use strict';

var express = require('express');
var router = express.Router();

var DocumentTypeService = require('./../../services/DocumentTypeService');
var TokenService = require('./../../services/TokenService');
var DocumentTypeController = require('./../../controllers/DocumentTypeController');

//!** Get all documentType
router.get('/', [
  TokenService.validateToken,
  DocumentTypeService.getAll,
  DocumentTypeController.getDocumentType
]);

//!** Get single documentType
router.get('/:id', [
  TokenService.validateToken,
  DocumentTypeService.searchById,
  DocumentTypeController.getDocumentType
]);

//!** Update documentType
router.put('/', [
  TokenService.validateToken,
  DocumentTypeService.validateUpdateDocumentTypeParams,
  DocumentTypeService.updateById,
  DocumentTypeController.getUpdatedDocumentType
]);

//!** Delete documentType
router.delete('/:id', [
  TokenService.validateToken,
  DocumentTypeService.searchById,
  DocumentTypeService.deleteById,
  DocumentTypeController.deleteDocumentType
]);

//!** Add new documentType
router.post('/', [
  TokenService.validateToken,
  DocumentTypeService.validateDocumentTypeParams,
  DocumentTypeService.searchByCode,
  DocumentTypeService.newDocumentType,
  DocumentTypeController.getNewDocumentType
]);

module.exports = router;