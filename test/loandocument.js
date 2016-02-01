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

// End point to test 

var endpointlogin = "/login";
var endpointlogout = "/logout";
var endpointsignup = "/signup";
var endpointuser = "/api/users";
var endpointdoc = "/api/documents";
var endpointloan = "/api/loan_documents";
var endpoint = "/api/entities";
var loan = "/api/loans";



var server = request.agent("http://localhost:"+config.server.port);
describe('*** LOAN DOCUMENT  APIs:', function () {
var token , docid, id , loan_doc_id , loanid, email, signid , entityid, loan_doc_id1
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
  describe('POST '+loan, function () {
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
          res.body.result.loan_type_id.should.equal(1);
          loanid = res.body.result.id;
          done();
        });
    });
  });
  describe('POST document'+endpointdoc, function () {
    this.timeout(10000)
    it('should return 200 OK, {error: false, message: "OK", result: {doc}}', function (done) {
    this.timeout(10000)
      server
        .post(endpointdoc)
        .set('x-access-token', token)
        .field('owner', entityid)
        .field('documentcode', 1)
        .field('documenttype_id', 1)
        .field('data', JSON.stringify({test: "test"}))
        .expect(200)
        .attach('file', 'test/i.png')
        .end( function(err, res) {
        res.body.error.should.equal(false);
        res.body.message.should.be.a("string");
        res.body.message.should.equal("Document insert complete!");
        docid = res.body.result.id;
        done();
        });
    })
  });
  describe('POST document'+endpointdoc, function () {
    this.timeout(10000)
    it('should return 200 OK, {error: false, message: "OK", result: {doc}}', function (done) {
    this.timeout(10000)
      server
        .post(endpointdoc)
        .set('x-access-token', token)
        .field('owner', entityid)
        .field('documentcode', 1)
        .field('documenttype_id', 1)
        .field('data', JSON.stringify({test: "test"}))
        .expect(200)
        .attach('file', 'test/i.png')
        .end( function(err, res) {
        res.body.error.should.equal(false);
        res.body.message.should.be.a("string");
        res.body.message.should.equal("Document insert complete!");
        id1 = res.body.result.id;
        done();
        });
    })
  });
  describe('POST  loan document'+ endpointloan, function () {
    it('should return 200 OK, {error: false, message: "OK", result: {loandocument}}', function (done) {
      server
        .post(endpointloan)
        .set('x-access-token', token)
        .send({document_id : id1 , loan_id : loanid})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          loan_doc_id = res.body.result.id;
          done();
        });
    });
  });
  describe('POST  loan document'+ endpointloan, function () {
    it('should return 200 OK, {error: false, message: "OK", result: {loandocument}}', function (done) {
      server
        .post(endpointloan)
        .set('x-access-token', token)
        .send({document_id : docid , loan_id : loanid})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          loan_doc_id1 = res.body.result.id;
          done();
        });
    });
  });
  describe('GET '+endpointloan, function () {
      it('should return 200 OK, {error: false, message: "string", result: [{loandoc}]}', function (done) {
          server
            .get(endpointloan)
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
  describe('GET (By given id)'+endpointloan, function () {
      it('should return 200 OK, {error: false, message: "string", result: {loandoc}}', function (done) {
          server
            .get(endpointloan + "/" + loan_doc_id)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end( function(err, res) {
              res.body.error.should.equal(false);
              res.body.message.should.be.a("string");
              res.body.message.should.equal("OK");
              res.body.result.id.should.equal(loan_doc_id);
              done();
            });
      });
  });
  describe('GET (By given id)'+endpointdoc + "/for_loan/", function () {
      it('should return 200 OK, {error: false, message: "string", result: {loandoc}}', function (done) {
          server
            .get(endpointdoc + "/for_loan/" + loanid)
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
  describe('PUT '+endpointloan, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .put(endpointloan)
        .set('x-access-token', token)
        .send({id : loan_doc_id, document_id : id1 , loan_id : loanid})
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
  describe('Delete '+endpointloan, function () {
      it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
          server
            .delete(endpointloan)
            .send({id : loan_doc_id})
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

   describe('Delete for /for_loan'+endpointloan, function () {
      it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
          server
            .delete(endpointloan + "/for_loan/" + loanid)
            .send({loan_id : loanid})
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
  describe('Delete '+endpoint, function () {
      it('should return 200 OK, {error: false, message: "string", result: [{entities}]}', function (done) {
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