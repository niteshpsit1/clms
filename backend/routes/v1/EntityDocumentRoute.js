'use strict';

var express = require('express');
var router = express.Router();

var EntityDocumentService = require('./../../services/EntityDocumentService');
var TokenService = require('./../../services/TokenService');
var EntityDocumentController = require('./../../controllers/EntityDocumentController');

//!** Get all entityDocument
router.get('/', [
  TokenService.validateToken,
  EntityDocumentService.getAllEntityDocument,
  EntityDocumentController.getEntityDocument
]);

//!** Get single entityDocument
router.get('/:id', [
  TokenService.validateToken,
  EntityDocumentService.searchById,
  EntityDocumentController.getEntityDocument
]);

//!** Update entityDocument
router.put('/', [
  TokenService.validateToken,
  EntityDocumentService.validateUpdateEntityDocumentParams,
  EntityDocumentService.updateById,
  EntityDocumentController.getUpdateEntityDocument
]);

//!** Delete entityDocument
router.delete('/:id', [
  TokenService.validateToken,
  EntityDocumentService.searchById,
  EntityDocumentService.deleteById,
  EntityDocumentController.deleteForEntityDocument
]);

//!** Delete ForEntityDocument
router.delete('/for-entity/:entityId', [
  TokenService.validateToken,
  EntityDocumentService.searchByEntityId,
  EntityDocumentService.deleteByEntityId,
  EntityDocumentController.deleteForEntityDocument
]);

//!** Add new entityDocument
router.post('/', [
  TokenService.validateToken,
  EntityDocumentService.validateEntityDocumentParams,
  EntityDocumentService.newEntityDocument,
  EntityDocumentController.getNewEntityDocument
]);

module.exports = router;