'use strict';

var express = require('express');
var router = express.Router();

var CollateralService = require('./../../services/CollateralService');
var TokenService = require('./../../services/TokenService');
var CollateralController = require('./../../controllers/CollateralController');

//!** Get all Collateral
router.get('/', [
  TokenService.validateToken,
  CollateralService.getAllCollateral,
  CollateralController.getCollateral
]);

//!** Get single Collateral
router.get('/:id', [
  TokenService.validateToken,
  CollateralService.searchById,
  CollateralController.getCollateral
]);

//!** Get entity Collateral
router.get('/for-entity/:entity_id', [
  TokenService.validateToken,
  CollateralService.searchEntityById,
  CollateralService.getAllCollateralByEntityId,
  CollateralController.getCollateral
]);

//!** Get loan for Collateral
router.get('/for-loan/:loan_id', [
  TokenService.validateToken,
  CollateralService.searchLoanById,
  CollateralService.getAllCollateralByLoanId,
  CollateralController.getCollateral
]);

//!** Update Collateral
router.put('/', [
  TokenService.validateToken,
  CollateralService.validateUpdateCollateralParams,
  CollateralService.updateById,
  CollateralController.getUpdatedCollateral
]);

//!** Delete Collateral
router.delete('/:id', [
  TokenService.validateToken,
  CollateralService.searchById,
  CollateralService.deleteById,
  CollateralController.deleteCollateral
]);

//!** Add new Collateral
router.post('/', [
  TokenService.validateToken,
  CollateralService.validateCollateralParams,
  CollateralService.searchLoanById,
  CollateralService.searchEntityById,
  CollateralService.newCollateral,
  CollateralController.getNewCollateral
]);

module.exports = router;