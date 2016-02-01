'use strict';

var express = require('express');
var router = express.Router();

var loanTypeService = require('./../../services/LoanTypeService');
var TokenService = require('./../../services/TokenService');
var LoanTypeController = require('./../../controllers/LoanTypeController');

//!** Get all loanType
router.get('/', [
  TokenService.validateToken,
  loanTypeService.getAll,
  LoanTypeController.getLoanType
]);

//!** Get single loanType
router.get('/:id', [
  TokenService.validateToken,
  loanTypeService.searchById,
  LoanTypeController.getLoanType
]);

//!** Update loanType
router.put('/', [
  TokenService.validateToken,
  loanTypeService.validateUpdateLoanTypeParams,
  loanTypeService.updateById,
  LoanTypeController.getUpdatedLoanType
]);

//!** Delete loanType
router.delete('/:id', [
  TokenService.validateToken,
  loanTypeService.searchById,
  loanTypeService.deleteById,
  LoanTypeController.deleteLoanType
]);

//!** Add new loanType
router.post('/', [
  TokenService.validateToken,
  loanTypeService.validateLoanTypeParams,
  loanTypeService.searchByCode,
  loanTypeService.newLoanType,
  LoanTypeController.getNewLoanType
]);

module.exports = router;