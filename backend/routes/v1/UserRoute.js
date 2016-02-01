'use strict';

var express = require('express');
var router = express.Router();
var UserService = require('./../../services/UserService');
var TokenService = require('./../../services/TokenService');
var UserController = require('./../../controllers/UserController');

//** User SignUp
router.post('/signup', [
  UserService.validateSignUpParams,
  UserService.searchByEmail,
  UserService.newUser,
  UserController.registerUser
]);

//** User logIn
router.post('/login', [
  UserService.validateLoginParams,
  UserService.login,
  UserController.loginUser
]);

//** User logout
router.get('/app/logout', [
  TokenService.validateToken,
  UserService.logout,
  UserController.logoutUser
]);

//** Get all users
router.get('/', [
  TokenService.validateToken,
  UserService.getAllUser,
  UserController.getUser
]);

//** Get single users
router.get('/:id', [
  UserService.searchById,
  UserController.getUser
]);

//** Update users
router.put('/', [
  UserService.validateUpdateUserParams,
  UserService.updateById,
  UserController.getUpdatedUser
]);

//** Delete users
router.delete('/:id', [
  UserService.searchById,
  UserService.deleteById,
  UserController.deleteUser
]);

//** Add new users
router.post('/', [
  UserService.validateUserParams,
  UserService.searchByEmail,
  UserService.newUser,
  UserController.getNewUser
]);

module.exports = router;