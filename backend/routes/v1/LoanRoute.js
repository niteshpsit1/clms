'use strict';

var express = require('express');
var router = express.Router();

var LoanService = require('./../../services/LoanService');
var TokenService = require('./../../services/TokenService');
var LoanController = require('./../../controllers/LoanController');

//!** Get all loan
router.get('/', [
  TokenService.validateToken,
  LoanService.getAll,
  LoanController.getLoan
]);

//!** Get single loan
router.get('/:id', [
  TokenService.validateToken,
  LoanService.searchById,
  LoanController.getLoan
]);

//!** Get single loan
router.get('/for-entity/:entity_id', [
  TokenService.validateToken,
  LoanService.searchEntityById,
  LoanService.searchAllLoanEntityByEntityId,
  LoanService.getLoanForEntity,
  LoanController.getLoan
]);

//!** Get entity for loan
router.get('/entity-for-loan/:loan_id', [
  TokenService.validateToken,
  LoanService.searchLoanById,
  LoanService.searchAllLoanEntityByLoanId,
  LoanService.getEntityForLoan,
  LoanController.getLoan
]);

//!** Update loan
router.put('/', [
  TokenService.validateToken,
  LoanService.validateUpdateLoanParams,
  LoanService.updateById,
  LoanController.getUpdatedLoan
]);

//!** Delete loan
router.delete('/:id', [
  TokenService.validateToken,
  LoanService.searchById,
  LoanService.deleteById,
  LoanController.deleteLoan
]);

//!** Add new loan
router.post('/', [
  TokenService.validateToken,
  LoanService.validateLoanParams,
  LoanService.searchEntityRoleById,
  LoanService.searchLoanTypeById,
  LoanService.searchEntityById,
  LoanService.newLoan,
  LoanController.getNewLoan
]);

module.exports = router;