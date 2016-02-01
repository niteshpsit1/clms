'use strict';

var express = require('express');
var router = express.Router();

var CollateralDocumentService = require('./../../services/CollateralDocumentService');
var TokenService = require('./../../services/TokenService');
var CollateralDocumentController = require('./../../controllers/CollateralDocumentController');

//!** Get all collateralDocument
router.get('/', [
  TokenService.validateToken,
  CollateralDocumentService.getAllCollateralDocument,
  CollateralDocumentController.getCollateralDocument
]);

//!** Get single collateralDocument
router.get('/:id', [
  TokenService.validateToken,
  CollateralDocumentService.searchById,
  CollateralDocumentController.getCollateralDocument
]);

//!** Update collateralDocument
router.put('/', [
  TokenService.validateToken,
  CollateralDocumentService.validateUpdateCollateralDocumentParams,
  CollateralDocumentService.updateById,
  CollateralDocumentController.getUpdatedCollateralDocument
]);

//!** Delete collateralDocument
router.delete('/:id', [
  TokenService.validateToken,
  CollateralDocumentService.searchById,
  CollateralDocumentService.deleteById,
  CollateralDocumentController.deleteCollateralDocument
]);

//!** Delete forLoan
router.delete('/for-collateral/:collateral_id', [
  TokenService.validateToken,
  CollateralDocumentService.searchByCollateralId,
  CollateralDocumentService.deleteByCollateralId,
  CollateralDocumentController.deleteCollateralDocument
]);

//!** Add new collateralDocument
router.post('/', [
  TokenService.validateToken,
  CollateralDocumentService.validateCollateralDocumentParams,
  CollateralDocumentService.newCollateralDocument,
  CollateralDocumentController.getNewCollateralDocument
]);

module.exports = router;