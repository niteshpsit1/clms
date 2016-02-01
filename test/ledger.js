/*/**
 * Mocha tests for API:  "/"
 *
 * @author deepak kumar <deepak.kumar@daffodilsw.com>
 * @created 30/12/2015
 */


var request = require('supertest');
var should  = require('chai').should();
var config  = require('../config/backend.config');
var mock = require('./mock');
var Faker = require('faker2');
var Account = require("../backend/models/models").Account;
// End point to test 

var entityledger = "/api/ledgers";
var endpointlogin = "/login";
var endpointlogout = "/logout";
var endpointsignup = "/signup";
var endpointuser = "/api/users";
var loan = "/api/loans";
var endpoint = "/api/entities";

Account.find({ where: { id: parseInt(101) } })
          .then(function (account) {
            if (account) {
              account.destroy();
            }
            })


var server = request.agent("http://localhost:"+config.server.port);


describe('*** LEDGER APIs:', function () {
var token , id, email, signid , AccountDetail ,Account_id, loanid, ledgerId
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
          var objUser = {
              id: 101,
              name: "deepak",
          };
          AccountDetail =  Account.create(objUser);
          Account_id = AccountDetail._boundTo.dataValues.id;
          done();
        });
    });
  });
  describe('GET '+entityledger, function () {
    it('should return 200 OK , {error: false, message: "OK", result: [{ledger}]}', function (done) {
      server
        .get(entityledger)
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
          loanid = res.body.result.id;
          done();
        });
    });
  });
  describe('POST  ledger'+ entityledger, function () {
    it('should return 200 OK, {error: false, message: "OK", result: {ledger}}', function (done) {
      server
        .post(entityledger)
        .set('x-access-token', token)
        .send({name: "test", loan_id : loanid, account_id :Account_id , 
        amount :231, projection : "test", datedue : "2015-12-27T18:30:00.000Z",
        installment : 12, principal :281, interest : 2 , balance: 12})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          res.body.result.account_id.should.equal(Account_id);
          ledgerId = res.body.result.id;
          done();
        });
    });
  });
  describe('PUT  ledger'+ entityledger, function () {
    it('should return 200 OK, {error: false, message: "OK", result: {ledger}}', function (done) {
      server
        .put(entityledger)
        .set('x-access-token', token)
        .send({id : ledgerId , name: "test", loan_id : loanid, account_id :Account_id , 
        amount :232, projection : "test", datedue : "2015-12-27T18:30:00.000Z",
        installment : 12, principal :281, interest : 2 , balance: 12})
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
  describe('GET by account id '+entityledger, function () {
    it('should return 200 OK , {error: false, message: "OK", result: [{ledger}]}', function (done) {
      server
        .get(entityledger + "/for_account/" + Account_id)
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
   describe('GET ledger by loan id '+entityledger, function () {
    it('should return 200 OK , {error: false, message: "OK", result: [{ledger}]}', function (done) {
      server
        .get(entityledger + "/" + loanid)
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
  describe('GET ledger by  id '+ entityledger, function () {
    it('should return 200 OK , {error: false, message: "OK", result: [{ledger}]}', function (done) {
      server
        .get(entityledger + "/" + ledgerId)
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
  
  
  describe('Delete entity'+endpoint, function () {
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
  
  describe('Delete Ledger '+ entityledger, function () {
      it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
          server
            .delete(entityledger)
            .send({id : ledgerId})
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