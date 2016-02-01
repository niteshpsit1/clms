/*
 * Mocha tests for API: "/api/users".
 *
 * @author: Daniele Gazzelloni <daniele@danielegazzelloni.com>
 ********************************************************************/

var request = require('supertest');
var should  = require('chai').should();
var config  = require('../config/backend.config');
var mock = require('./mock');


// Endpoint to test
var endpoint = "/api/users";
var endpointlogin = "/login";
var endpointlogout = "/logout";
var endpointsignup = "/signup";

// Object for register user

var user = {
  name : "test",
  age: 21, 
  email:"testingtest2@gmail.com",
  password: 1234567
}


var server = request.agent("http://localhost:"+config.server.port);

describe('*** USERS APIs:', function () {
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
    it('should return 200 OK login, {error: false, message: "OK", result: []}', function (done) {
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
          done();
        });
    });
  });

  describe('POST '+endpoint, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .post(endpoint)
        .set('x-access-token', token)
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          //res.body.result.should.be.instanceof(Array);
          id = res.body.result.id;
          done();
        });
    });
  });

  describe('POST '+endpoint+' (with missing parameters)', function () {
    it('should return 200 OK, {error: true, message: "string", result: []}', function (done) {
      server
        .post(endpoint)
        .set('x-access-token', token)
        .send({name: "Parameters Missing"})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(true);
          res.body.message.should.be.a("string");
          res.body.result.should.be.instanceof(Array);
          done();
        });
    });
  });

  describe('GET '+endpoint, function () {
    it('should return 200 OK, {error: false, message: "string", result: [{user}]}', function (done) {
      server
        .get(endpoint)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.be.a("string");
          res.body.result.should.be.instanceof(Array);
          done();
        });
    });
  });

  describe('GET '+endpoint+' (id given)', function () {
    it('should return 200 OK, {error: false, message: "string", result: {user} }', function (done) {
      server
        .get(endpoint + "/" + id)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.result.id.should.equal(id);
          res.body.result.name.should.equal(user.name);
          res.body.result.age.should.equal(user.age);
          res.body.result.email.should.equal(user.email);
          res.body.message.should.be.a("string");
          done();
        });
    });
  });

  describe('PUT '+endpoint, function () {
    it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {

      var customUser = {
        id: id,
        name: "John Ching",
        age: user.age,
        email: user.email,
        password: user.password
      };

      server
        .put(endpoint)
        .set('x-access-token', token)
        .send(customUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.be.a("string");
          res.body.result.should.be.instanceof(Array);
          done();
        });
    });
  });

  describe('DELETE '+endpoint, function () {
    it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
      server
        .delete(endpoint)
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
  describe('DELETE '+endpoint, function () {
    it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
      server
        .delete(endpoint)
        .set('x-access-token', token)
        .send({id: id})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.be.a("string");
          done();
        });
    });
  });
 /* describe('LOGOUT '+ endpointlogout, function () {
    it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
      server
        .get(endpointlogout)
        .set('x-access-token', token)
        .send({id: 2, email: login.email, name: "deepak", token: token})
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