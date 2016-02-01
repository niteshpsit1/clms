'use strict';

var express = require('express');
var router = express.Router();

var EntityService = require('./../../services/EntityService');
var TokenService = require('./../../services/TokenService');
var EntityController = require('./../../controllers/EntityController');

//** User logIn
router.post('/login', [
  EntityService.validateLoginParams,
  EntityService.loginEntity,
  EntityController.loginEntity
]);

//** User logout
router.get('/logout', [
  TokenService.validateToken,
  EntityService.logoutEntity,
  EntityController.logoutEntity
]);

//!** Get all entitys
router.get('/', [
  TokenService.validateToken,
  EntityService.getAllEntity,
  EntityController.getEntity
]);

//!** Get single entitys
router.get('/:id', [
  TokenService.validateToken,
  EntityService.searchById,
  EntityController.getEntity
]);

//!** Update entitys
router.put('/', [
  TokenService.validateToken,
  EntityService.validateUpdateEntityParams,
  EntityService.updateById,
  EntityController.getUpdatedEntity
]);

//!** Delete entitys
router.delete('/:id', [
  TokenService.validateToken,
  EntityService.searchById,
  EntityService.deleteById,
  EntityController.deleteEntity
]);

//!** Add new entitys
router.post('/', [
  TokenService.validateToken,
  EntityService.validateEntityParams,
  EntityService.searchByEmail,
  EntityService.newEntity,
  EntityController.getNewEntity
]);

module.exports = router;