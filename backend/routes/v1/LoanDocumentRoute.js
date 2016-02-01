'use strict';

var express = require('express');
var router = express.Router();

var LoanDocumentService = require('./../../services/LoanDocumentService');
var TokenService = require('./../../services/TokenService');
var LoanDocumentController = require('./../../controllers/LoanDocumentController');

//!** Get all loanDocument
router.get('/', [
  TokenService.validateToken,
  LoanDocumentService.getAllLoanDocument,
  LoanDocumentController.getLoanDocument
]);

//!** Get single loanDocument
router.get('/:id', [
  TokenService.validateToken,
  LoanDocumentService.searchById,
  LoanDocumentController.getLoanDocument
]);

//!** Update loanDocument
router.put('/', [
  TokenService.validateToken,
  LoanDocumentService.validateUpdateLoanDocumentParams,
  LoanDocumentService.updateById,
  LoanDocumentController.getUpdatedLoanDocument
]);

//!** Delete loanDocument
router.delete('/:id', [
  TokenService.validateToken,
  LoanDocumentService.searchById,
  LoanDocumentService.deleteById,
  LoanDocumentController.deleteLoanDocument
]);

//!** Delete forLoan
router.delete('/for-loan/:loan_id', [
  TokenService.validateToken,
  LoanDocumentService.searchByLoanId,
  LoanDocumentService.deleteByLoanId,
  LoanDocumentController.deleteLoanDocument
]);

//!** Add new loanDocument
router.post('/', [
  TokenService.validateToken,
  LoanDocumentService.validateLoanDocumentParams,
  LoanDocumentService.newLoanDocument,
  LoanDocumentController.getNewLoanDocument
]);

module.exports = router;