/*/**
 * Mocha tests for API:  "/"
 *
 * @author deepak kumar <deepak.kumar@daffodilsw.com>
 * @created 05/01/2016
 */


var request = require('supertest');
var should  = require('chai').should();
var config  = require('../config/backend.config');
var mock = require('./mock');

// End point to test
var endpointlogin = "/login";
var endpointlogout = "/logout";
var endpointsignup = "/signup";
var endpoint = "/api/entities";
var endpointentity = "/entity/login";
var endpointentitylogout = "/entity/logout";
var endpointuser = "/api/users";





var server = request.agent("http://localhost:"+config.server.port);

describe('*** PASSPORT APIs:', function () {
  var token , id, email, signid , emailentity
  describe('POST '+endpointsignup, function () {
    it('should return 200 OK signup, {error: false, message: "OK", result: []}', function (done) {
      server
        .post(endpointsignup)
        .send(mock.signup)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          email = res.body.result.email;
          res.body.result.age.should.equal(mock.signup.age);
          res.body.result.name.should.equal(mock.signup.name);
          done();
        });
    });
  });
  describe('POST '+endpointlogin, function () {
    it('should return 200 OK login, {error: false, message: "OK", result: []}', function (done) {
      this.timeout(10000)
      server
        .post(endpointlogin)
        .send({email: email, password: '1234567'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          token = res.body.result.token
          signid = res.body.result.id;
          res.body.result.email.should.equal(mock.signup.email);
          res.body.result.name.should.equal(mock.signup.name);
          res.body.message.should.equal("OK");
          res.statusCode.should.equal(200);
          done();
        });
    });
  });
  describe('POST (with invalid credentials)'+endpointlogin, function () {
    it('should return 401 error on login, { error: true, message: "user not found", result: [] }', function (done) {
      this.timeout(10000)
      server
        .post(endpointlogin)
        .send({email: "abc@gmail.com", password: '1234567'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(true);
          res.body.message.should.equal("user not found");
          res.statusCode.should.equal(401);
          done();
        });
    });
  });
  describe('POST  entity'+endpoint, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .post(endpoint)
        .set('x-access-token', token)
        .send(mock.entity)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          emailentity  = res.body.result.data.email;
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          id = res.body.result.id;
          done();
        });
    });
  });
  describe('POST '+endpointentity, function () {
    it('should return 200 OK entity login, {error: false, message: "OK", result: []}', function (done) {
      this.timeout(10000)
      server
        .post(endpointentity)
        .send({email: emailentity, password: '1234567'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          res.statusCode.should.equal(200);
          done();
        });
    });
  });
  describe('POST (login with invalid credentials)'+endpointentity, function () {
    it('should return 401 error onentity login, { error: true, message: "user not found", result: [] }', function (done) {
      this.timeout(10000)
      server
        .post(endpointentity)
        .send({email: "abc@gmail.com", password: 1234567})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(true);
          res.body.message.should.equal("user not found");
          res.statusCode.should.equal(401);
          done();
        });
    });
  });
  
  describe('Delete entity'+endpoint, function () {
      it('should return 200 OK, {error: false, message: "string", result: [{entities}]}', function (done) {
          server
            .delete(endpoint)
            .send({id : id})
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end( function(err, res) {
              res.body.error.should.equal(false);
              res.body.message.should.be.a("string");
              done();
            });
      });
  });
  describe('DELETE USER'+endpointuser, function () {
    it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
      server
        .delete(endpointuser)
        .set('x-access-token', token)
        .send({id: signid})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.be.a("string");
          done();
        });
    });
  });
  /*describe('Logout  entity'+endpointentitylogout, function () {
    it('should return 200 OK login, {error: false, message: "OK", result: []}', function (done) {
      server
        .get(endpointentitylogout)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
        res.body.error.should.equal(false);
        res.body.message.should.be.a("string");
        done();
        });
    });
  });*/
});