'use strict';

var express = require('express');
var router = express.Router();

var kontoxService = require('./../../services/KontoxService');
var TokenService = require('./../../services/TokenService');
var KontoxController = require('./../../controllers/KontoxController');

//!** Get all kontox
router.get('/account-info/for-entity/:entity_id', [
  TokenService.validateToken,
  kontoxService.getAccountInfoForEntity,
  KontoxController.getKontox
]);

//!** Get single kontox
router.get('/aggregate', [
  TokenService.validateToken,
  kontoxService.aggregates
]);

//!** Add new kontox
router.post('/', [
  TokenService.validateToken,
  kontoxService.add
]);

//!** Add new kontox
router.post('/sign-out', [
  TokenService.validateToken,
  kontoxService.signOut
]);

//!** Add new kontox
router.post('/import-account', [
  TokenService.validateToken,
  kontoxService.importAccounts
]);

//!** Add new kontox
router.post('/import-account-transaction', [
  TokenService.validateToken,
  kontoxService.importAccountTransaction
]);

//!** Add new kontox
router.post('/import-owner', [
  TokenService.validateToken,
  kontoxService.importOwners
]);

module.exports = router;