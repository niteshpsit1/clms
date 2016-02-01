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

var loan = "/api/loans";
var endpoint = "/api/entities";
var endpointlogin = "/login";
var endpointlogout = "/logout";
var endpointsignup = "/signup";
var endpointuser = "/api/users";

var user = {  
  loan_type_id:1,
  principal :"₹ 280,000.00",
  loanterm: 2,
  interestrate:"9%",
  role_id:1,
  entity_id:254,
  starting_date:"2015-12-27T18:30:00.000Z"
}


var server = request.agent("http://localhost:"+config.server.port);
describe('*** LOAN  APIs:', function () {
var token , id , loanid, email, signid
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
  
describe('POST  entity'+endpoint, function () {
    it('should return 200 OK, {error: false, message: "OK", result: {entity}}', function (done) {
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
          id = res.body.result.id;
          done();
        });
    });
  });
  
describe('POST '+loan, function () {
    it('should return 200 OK, {error: false, message: "OK", result: {loan}}', function (done) {
      server
        .post(loan)
        .set('x-access-token', token)
        .send({loan_type_id:1,principal :"₹ 280,000.00",loanterm: 2,interestrate:"9%",role_id:1,entity_id: id})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          res.body.result.loan_type_id.should.equal(user.loan_type_id);
          loanid = res.body.result.id;
          done();
        });
    });
  });
describe('PUT '+loan, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .put(loan)
        .set('x-access-token', token)
        .send({id :loanid, loan_type_id:1,principal :"₹ 290,000.00",loanterm: 2,interestrate:"9%",role_id:1})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          res.body.result.loan_type_id.should.equal(user.loan_type_id);
          loanid = res.body.result.id;
          done();
        });
    });
  });
describe('GET '+loan, function () {
      it('should return 200 OK, {error: false, message: "string", result: [{loan}]}', function (done) {
          server
            .get(loan + "/" + loanid)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end( function(err, res) {
              res.body.error.should.equal(false);
              res.body.message.should.be.a("string");
              res.body.message.should.equal("OK");
              done();
            });
      });
  });
describe('GET Loan (by given id)'+loan, function () {
      it('should return 200 OK, {error: false, message: "string", result: {loan}}', function (done) {
          server
            .get(loan)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end( function(err, res) {
              res.body.error.should.equal(false);
              res.body.message.should.be.a("string");
              res.body.message.should.equal("OK");
              done();
            });
      });
  });
describe('GET (by entity id given)'+loan+'/for_entity/', function () {
      it('should return 200 OK, {error: false, message: "string", result: {entity}}', function (done) {
          server
            .get(loan + "/for_entity/" + id)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end( function(err, res) {
              res.body.error.should.equal(false);
              res.body.message.should.be.a("string");
              res.body.message.should.equal("OK");
              done();
            });
      });
  });
describe('GET (by loan id given)'+loan+'/entity_for_loan/', function () {
      it('should return 200 OK, {error: false, message: "string", result: {loan}}', function (done) {
          server
            .get(loan + "/entity_for_loan/" + loanid)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end( function(err, res) {
              res.body.error.should.equal(false);
              res.body.message.should.be.a("string");
              res.body.message.should.equal("OK");
              done();
            });
      });
  });
  describe('Delete (entity by id) '+endpoint, function () {
      it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
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