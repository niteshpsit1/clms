/*/**
 * Mocha tests for API:  "/api/voip"
 *
 * @author deepak kumar <deepak.kumar@daffodilsw.com>
 * @created 24/12/2015
 */


var request = require('supertest');
var should  = require('chai').should();
var config  = require('../config/backend.config');
var mock = require('./mock');

// End point to test
var endpoint = "/api/voip";
var endpointlogin = "/login";
var endpointsignup = "/signup";
var endpointuser = "/api/users";

var voip = {
    src:"deepak",
    dst:"a"
}


var server = request.agent("http://localhost:"+config.server.port);

describe('*** Voip APIs:', function () {
  var token , email, signid, uniqueid, id
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
  describe('POST in login '+endpointlogin, function () {
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
          id = res.body.result.id;
          done();
        });
    });
  });
  describe('POST  voip'+endpoint, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .post(endpoint)
        .set('x-access-token', token)
        .send(voip)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          uniqueid = res.body.result.uniqueid;
          done();
        });
    });
  });
  describe('PUT '+endpoint, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .put(endpoint)
        .set('x-access-token', token)
        .send({uniqueid: uniqueid})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          res.body.result.uniqueid.should.equal(uniqueid);
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