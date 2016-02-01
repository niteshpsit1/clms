/*/**
 * Mocha tests for API:  "/"
 *
 * @author deepak kumar <deepak.kumar@daffodilsw.com>
 * @created 30/12/2015
 */


var request = require('supertest');
var should  = require('chai').should();
var config  = require('../config/backend.config');

// End point to test 

var endpointlogin = "/login";
var endpointlogout = "/logout";
var endpointsignup = "/signup";
var endpointuser = "/api/users";
var endpointdoc = "/api/documents";
var endpointcollateraldoc = "/api/collateral_documents";
var endpoint = "/api/entities";
var loan = "/api/loans";
var endpointcollateral = "/api/collateral";

var entity = {
    idnumber:12345678,
    name:"deepak",
    dba:"a",
    individual:true,
    data:{
    phone:1234567890,
    email:"extesttest70@gmail.com",
    password:1234567,
    website:"11111"
  }
}
var signup = {
  name : "test",
  age: 21, 
  email:"ttestingteast701@gmail.com",
  password: 1234567
}

var server = request.agent("http://localhost:"+config.server.port);
describe('*** COLLATERAL DOCUMENT  APIs:', function () {
var token , collateral_id , collateral_doc_id,collateral_doc_id1, docid, id  , loanid, email, signid , entityid
  describe('POST '+endpointsignup, function () {
    it('should return 200 OK signup, {error: false, message: "OK", result: []}', function (done) {
      server
        .post(endpointsignup)
        .send(signup)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          email = res.body.result.email;
          res.body.result.age.should.equal(signup.age);
          res.body.result.name.should.equal(signup.name);
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
          res.body.result.email.should.equal(signup.email);
          res.body.result.name.should.equal(signup.name);
          done();
        });
    });
  });
  describe('POST  entity'+endpoint, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .post(endpoint)
        .set('x-access-token', token)
        .send(entity)
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
          collateral_id = res.body.result.id;
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
        //setTimeout(done, 10000)
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
        //setTimeout(done, 10000)
        });
    })
  });
  describe('POST  collateral document'+ endpointcollateraldoc, function () {
    it('should return 200 OK, {error: false, message: "OK", result: {collateraldocument}}', function (done) {
      server
        .post(endpointcollateraldoc)
        .set('x-access-token', token)
        .send({document_id : id1 , collateral_id : collateral_id})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
        	res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          collateral_doc_id = res.body.result.id;
          done();
        });
    });
  });
  describe('POST  collateral document'+ endpointcollateraldoc, function () {
    it('should return 200 OK, {error: false, message: "OK", result: {collateraldocument}}', function (done) {
      server
        .post(endpointcollateraldoc)
        .set('x-access-token', token)
        .send({document_id : docid ,collateral_id : collateral_id})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          collateral_doc_id1 = res.body.result.id;
          done();
        });
    });
  });
  describe('GET '+endpointcollateraldoc, function () {
      it('should return 200 OK, {error: false, message: "string", result: [{collateraldoc}]}', function (done) {
          server
            .get(endpointcollateraldoc)
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
  describe('GET (By given id)'+endpointcollateraldoc, function () {
      it('should return 200 OK, {error: false, message: "string", result: {collateraldoc}}', function (done) {
          server
            .get(endpointcollateraldoc + "/" + collateral_doc_id)
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
 
  describe('PUT '+endpointcollateraldoc, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .put(endpointcollateraldoc)
        .set('x-access-token', token)
        .send({id : collateral_doc_id, document_id : id1 , collateral_id : collateral_id})
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
  describe('Delete '+endpointcollateraldoc, function () {
      it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
          server
            .delete(endpointcollateraldoc)
            .send({id : collateral_doc_id})
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

   describe('Delete for /for_collateral/ '+endpointcollateraldoc, function () {
      it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
          server
            .delete(endpointcollateraldoc + "/for_collateral/" + collateral_doc_id1)
            .send({collateral_id : collateral_doc_id1})
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
describe('Delete collateral(by id) '+endpointcollateral, function () {
  it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
    server
      .delete(endpointcollateral)
      .send({id :collateral_id})
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