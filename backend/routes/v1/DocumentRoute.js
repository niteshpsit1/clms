'use strict';

var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer();

var DocumentService = require('./../../services/DocumentService');
var TokenService = require('./../../services/TokenService');
var DocumentController = require('./../../controllers/DocumentController');

//!** Get all Document
router.get('/', [
  TokenService.validateToken,
  DocumentService.getAll,
  DocumentController.getDocument
]);

//!** Get single Document
router.get('/:id', [
  TokenService.validateToken,
  DocumentService.searchById,
  DocumentController.getDocument
]);

//!** Update Document
router.put('/', [
  TokenService.validateToken,
  DocumentService.validateUpdateDocumentParams,
  DocumentService.updateById,
  DocumentController.getUpdatedDocument
]);

//!** Delete Document
router.delete('/:id', [
  TokenService.validateToken,
  DocumentService.searchById,
  DocumentService.deleteById,
  DocumentController.deleteDocument
]);

//!** Add new Document
router.post('/', upload.single('file'), [
  TokenService.validateToken,
  DocumentService.validateDocumentParams,
  DocumentService.searchDocumentTypeById,
  DocumentService.newDocument,
  DocumentController.getDocument
]);

//!** Get single Document
router.get('/for-entity/:entity_id', [
  TokenService.validateToken,
  DocumentService.searchEntityById,
  DocumentService.searchAllEntityDocumentByEntityId,
  DocumentService.getDocumentForEntity,
  DocumentController.getDocument
]);

//!** Get entity for Document
router.get('/for-loan/:loan_id', [
  TokenService.validateToken,
  DocumentService.searchLoanById,
  DocumentService.searchAllLoanDocumentByLoanId,
  DocumentService.getDocumentForLoan,
  DocumentController.getDocument
]);

//!** Get entity for Document
router.get('/for-collateral/:collateral_id', [
  TokenService.validateToken,
  DocumentService.searchCollateralById,
  DocumentService.searchAllCollateralDocumentByCollateralId,
  DocumentService.getDocumentForCollateral,
  DocumentController.getDocument
]);

//!** Add new Document
router.post('/uploadandrelate', upload.single('file'), [
  TokenService.validateToken,
  DocumentService.validateDocumentInsertAndRelateParams,
  DocumentService.searchDocumentTypeById,
  DocumentService.searchEntityById,
  DocumentService.searchLoanById,
  DocumentService.searchCollateralById,
  DocumentService.addUploadAndRelate,
  DocumentController.getNewDocument
]);

module.exports = router;