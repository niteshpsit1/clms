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

//ROUTE: /api/collateral

// End point to test 

var endpointcollateral = "/api/collateral";
var endpointlogin = "/login";
var endpoint = "/api/entities";
var loan = "/api/loans";
var endpointsignup = "/signup";
var endpointuser = "/api/users";




var server = request.agent("http://localhost:"+config.server.port);


describe('*** COLLATERAL APIs:', function () {
var token , entityid, id, loanid, email, signid
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
          token = res.body.result.token;
          signid = res.body.result.id;
          res.body.result.email.should.equal(mock.signup.email);
          res.body.result.name.should.equal(mock.signup.name);
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
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          entityid = res.body.result.id;
          done();
        });
    });
  });
  describe('POST loan'+loan, function () {
    it('should return 200 OK, {error: false, message: "OK", result: {loan}}', function (done) {
      server
        .post(loan)
        .set('x-access-token', token)
        .send({loan_type_id:1,principal :"₹ 280,000.00",loanterm: 2,interestrate:"9%",role_id:1,entity_id: entityid})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          loanid = res.body.result.id;
          done();
        });
    });
  });
  describe('POST collateral'+endpointcollateral, function () {
    it('should return 200 OK, {error: false, message: "OK", result: {collateral}}', function (done) {
      server
        .post(endpointcollateral)
        .set('x-access-token', token)
        .send({name:"test",valuation:"1000", entity_id: entityid ,loan_id: loanid})
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
  
  describe('GET '+ endpointcollateral, function () {
    it('should return 200 OK, {error: false, message: "OK", result: [{collateral}]}', function (done) {
      server
        .get(endpointcollateral)
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
  describe('GET (collateral by id)'+ endpointcollateral, function () {
    it('should return 200 OK , {error: false, message: "OK", result: {collateral}}', function (done) {
      server
        .get(endpointcollateral + "/"+ id)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.be.a("string");
          res.body.result.entity_id.should.equal(entityid);
          res.body.result.loan_id.should.equal(loanid);
          done();
        });
    });
  });
  describe('GET (collateral by entity id)'+ endpointcollateral, function () {
    it('should return 200 OK , {error: false, message: "OK", result: {collateral}}', function (done) {
      server
        .get(endpointcollateral + "/for_entity/"+ entityid)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.be.a("string");
          res.body.result[0].entity_id.should.equal(entityid);
          res.body.result[0].loan_id.should.equal(loanid);
          done();
        });
    });
  });
   describe('GET (collateral by loan id)'+ endpointcollateral, function () {
    it('should return 200 OK , {error: false, message: "OK", result: {collateral}}', function (done) {
      server
        .get(endpointcollateral + "/for_loan/"+ loanid)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.be.a("string");
          res.body.result[0].entity_id.should.equal(entityid);
          res.body.result[0].loan_id.should.equal(loanid);
          done();
        });
    });
  });
  describe('PUT collateral'+endpointcollateral, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .put(endpointcollateral)
        .set('x-access-token', token)
        .send({id:id, name:"test",valuation:"1000", entity_id: entityid ,loan_id: loanid})
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


describe('Delete collateral(by id) '+endpointcollateral, function () {
  it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
    server
      .delete(endpointcollateral)
      .send({id :id})
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
describe('Delete (entity by id) '+endpoint, function () {
  it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
    server
      .delete(endpoint)
      .send({id : entityid})
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
describe('Delete (loan by id) '+loan, function () {
  it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
    server
      .delete(loan)
      .send({id : loanid})
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
