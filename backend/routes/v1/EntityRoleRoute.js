'use strict';

var express = require('express');
var router = express.Router();

var EntityRoleService = require('./../../services/EntityRoleService');
var TokenService = require('./../../services/TokenService');
var EntityRoleController = require('./../../controllers/EntityRoleController');

//!** Get all entityRole
router.get('/', [
  TokenService.validateToken,
  EntityRoleService.getAllEntityRole,
  EntityRoleController.getEntityRole
]);

//!** Get single entityRole
router.get('/:id', [
  TokenService.validateToken,
  EntityRoleService.searchById,
  EntityRoleController.getEntityRole
]);

//!** Update entityRole
router.put('/', [
  TokenService.validateToken,
  EntityRoleService.validateUpdateEntityRoleParams,
  EntityRoleService.updateById,
  EntityRoleController.getUpdatedEntityRole
]);

//!** Delete entityRole
router.delete('/:id', [
  TokenService.validateToken,
  EntityRoleService.searchById,
  EntityRoleService.deleteById,
  EntityRoleController.deleteEntityRole
]);

//!** Add new entityRole
router.post('/', [
  TokenService.validateToken,
  EntityRoleService.validateEntityRoleParams,
  EntityRoleService.searchByName,
  EntityRoleService.newEntityRole,
  EntityRoleController.getNewEntityRole
]);

module.exports = router;
