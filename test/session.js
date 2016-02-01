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
var endpointuser = "/api/users";
var endpoint = "/api/entities";
var endpointKey = "/api/apikey";

var server = request.agent("http://localhost:"+config.server.port);

describe('*** SESSION APIs:', function () {
var token , id, email, signid, key 
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
   describe('POST (api key) '+ endpointKey, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .post(endpointKey)
        .set('x-access-token', token)
        .send({})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
        	key = res.body.result.key;
          res.body.error.should.equal(false);
          res.body.message.should.be.a("string");
          res.body.message.should.equal("OK");
          done();
        });
    });
  });
  describe('GET (Check api without token)'+endpoint, function () {
      it('should return 200 OK, {error: true, message: "string", result: []}', function (done) {
          server
            .get(endpoint)
            .expect('Content-Type', /json/)
            .expect(200)
            .end( function(err, res) {
            	res.body.error.should.equal(true);
              res.body.message.should.be.a("string");
              res.body.message.should.equal("No token provided.");
              res.body.result.should.be.instanceof(Array);
              done();
            });
      });
  });

  describe('GET (Check api with invalid api key)'+endpoint, function () {
      it('should return 200 OK, {error: true, message: "string", result: []}', function (done) {
          server
            .get(endpoint)
            .set('x-api-key', 'test')
            .expect('Content-Type', /json/)
            .expect(200)
            .end( function(err, res) {
            	res.body.error.should.equal(true);
              res.body.message.should.be.a("string");
              res.body.message.should.equal("Failed to authenticate, Api Key not found");
              res.body.result.should.be.instanceof(Array);
              done();
            });
      });
  });
  describe('GET (Check api with valid api key)'+endpoint, function () {
      it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
          server
            .get(endpoint)
            .set('x-api-key', key)
            .expect('Content-Type', /json/)
            .expect(200)
            .end( function(err, res) {
            	res.body.error.should.equal(false);
              res.body.message.should.be.a("string");
              res.body.message.should.equal("OK");
              res.body.result.should.be.instanceof(Array);
              done();
            });
      });
  });
  describe('GET (get apikey)'+endpointKey, function () {
      it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
          server
            .get(endpointKey)
            .set('x-api-key', key)
            .expect('Content-Type', /json/)
            .expect(200)
            .end( function(err, res) {
            	res.body.error.should.equal(false);
              res.body.message.should.be.a("string");
              res.body.message.should.equal("OK");
              res.body.result.id.should.equal(key);
              res.body.result.active.should.equal('yes');
              done();
            });
      });
  });
  describe('GET (Check api with invalid token)'+endpoint, function () {
      it('should return 200 OK, {error: true, message: "string", result: []}', function (done) {
          server
            .get(endpoint)
            .set('x-access-token', '1234567')
            .expect('Content-Type', /json/)
            .expect(200)
            .end( function(err, res) {
            	res.body.error.should.equal(true);
              res.body.message.should.be.a("string");
              res.body.message.should.equal("Failed to authenticate token.");
              res.body.result.should.be.instanceof(Array);
              done();
            });
      });
  });
  describe('DELETE (delete api call with valid token)'+endpointuser, function () {
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