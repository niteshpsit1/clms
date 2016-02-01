'use strict';

var express = require('express');
var router = express.Router();

var LedgerService = require('./../../services/LedgerService');
var TokenService = require('./../../services/TokenService');
var LedgerController = require('./../../controllers/LedgerController');

//!** Get all ledger
router.get('/', [
  TokenService.validateToken,
  LedgerService.getAll,
  LedgerController.getLedger
]);

//!** Get single ledger
router.get('/:id', [
  TokenService.validateToken,
  LedgerService.searchById,
  LedgerController.getLedger
]);

//!** Get single ledger
router.get('/for-account/:account_id', [
  TokenService.validateToken,
  LedgerService.searchByAccountId,
  LedgerService.getAllLedgerByAccountId,
  LedgerController.getLedger
]);

//!** Get entity for ledger
router.get('/for-loan/:loan_id', [
  TokenService.validateToken,
  LedgerService.searchByLoanId,
  LedgerService.getAllLedgerByLoanId,
  LedgerController.getLedger
]);

//!** Update ledger
router.put('/', [
  TokenService.validateToken,
  LedgerService.validateUpdateLedgerParams,
  LedgerService.updateById,
  LedgerController.getUpdatedLedger
]);

//!** Delete ledger
router.delete('/:id', [
  TokenService.validateToken,
  LedgerService.searchById,
  LedgerService.deleteById,
  LedgerController.deleteLedger
]);

//!** Add new ledger
router.post('/', [
  TokenService.validateToken,
  LedgerService.validateLedgerParams,
  LedgerService.newLedger,
  LedgerController.getNewLedger
]);

module.exports = router;