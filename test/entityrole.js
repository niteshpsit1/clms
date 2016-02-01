/*/**
 * Mocha tests for API:  "/"
 *
 * @author deepak kumar <deepak.kumar@daffodilsw.com>
 * @created 25/12/2015
 */


var request = require('supertest');
var should  = require('chai').should();
var config  = require('../config/backend.config');
var mock = require('./mock');

// End point to test 

var entityrole = "/api/entity_roles";
var endpointlogin = "/login";
var endpointlogout = "/logout";
var endpointsignup = "/signup";
var endpointuser = "/api/users";



var server = request.agent("http://localhost:"+config.server.port);


describe('*** ENTITY ROLE APIs:', function () {
var token , id, email, signid
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
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .post(endpointlogin)
        .send({email: email, password: '1234567'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          token = res.body.result.token;
          signid = res.body.result.id;
          res.body.result.email.should.equal(mock.signup.email);
          res.body.result.name.should.equal(mock.signup.name);
          done();
        });
    });
  });
  describe('GET in entity role api '+endpointlogin, function () {
    it('should return 200 OK , {error: false, message: "OK", result: []}', function (done) {
      server
        .get(entityrole)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          done();
        });
    });
  });
  
  describe('POST '+endpointlogin, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .post(entityrole)
        .set('x-access-token', token)
        .send({name : 'test2'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          id = res.body.result.id;
          done();
        });
    });
  });
  describe('GET (By given id) '+endpointlogin, function () {
    it('should return 200 OK , {error: false, message: "OK", result: []}', function (done) {
      server
        .get(entityrole + "/" + id)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          done();
        });
    });
  });
  describe('PUT '+endpointlogin, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .put(entityrole)
        .set('x-access-token', token)
        .send({id : id})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          done();
        });
    });
  });
  describe('DELETE' + endpointlogin, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
     server
      .delete(entityrole)
        .set('x-access-token', token)
        .send({id : id})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          done();
        });
      });
  }); 
 
  describe('DELETE '+endpointuser, function () {
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
}); 