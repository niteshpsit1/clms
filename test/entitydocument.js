/*/**
 * Mocha tests for API:  "/"
 *
 * @author deepak kumar <deepak.kumar@daffodilsw.com>
 * @created 29/12/2015
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
var entitydoc = "/api/entity_documents";
var endpointdoc = "/api/documents";
var endpoint = "/api/entities";



var server = request.agent("http://localhost:"+config.server.port);
describe('*** ENTITY DOCUMENT  APIs:', function () {
var token , ent_id, id ,id1 , loanid, email, signid , entityid
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
  describe('GET '+entitydoc, function () {
      it('should return 200 OK, {error: false, message: "string", result: [{entitydoc}]}', function (done) {
          server
            .get(entitydoc)
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
  describe('POST '+endpointdoc, function () {
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
        id = res.body.result.id;
        done();
        //setTimeout(done, 10000)
        });
    })
  });
  describe('POST '+entitydoc, function () {
    it('should return 200 OK, {error: false, message: "OK", result: {entitydoc}}', function (done) {
      server
        .post(entitydoc)
        .set('x-access-token', token)
        .send({document_id : id, entity_id : entityid})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string");
          ent_id = res.body.result.id
          done();
        });
    });
  });
  describe('POST '+endpointdoc, function () {
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
 
  describe('POST '+entitydoc, function () {
    it('should return 200 OK, {error: false, message: "OK", result: {entitydoc}}', function (done) {
      server
        .post(entitydoc)
        .set('x-access-token', token)
        .send({document_id : id1, entity_id : entityid})
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
  describe('GET (By given id)'+entitydoc, function () {
      it('should return 200 OK, {error: false, message: "string", result: {entitydoc}}', function (done) {
          server
            .get(entitydoc + "/" + ent_id)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end( function(err, res) {
              res.body.error.should.equal(false);
              res.body.message.should.be.a("string");
              res.body.message.should.equal("OK");
              res.body.result.id.should.equal(ent_id);
              done();
            });
      });
  });
 describe('PUT '+entitydoc, function () {
    it('should return 200 OK, {error: false, message: "OK", result: {entitydoc}}', function (done) {
      server
        .put(entitydoc)
        .set('x-access-token', token)
        .send({id : ent_id, document_id : id, entity_id : entityid})
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
  describe('GET (By given id)'+endpointdoc, function () {
      it('should return 200 OK, {error: false, message: "string", result: {doc}}', function (done) {
          server
            .get(endpointdoc + "/" + id)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end( function(err, res) {
              res.body.error.should.equal(false);
              res.body.message.should.be.a("string");
              res.body.message.should.equal("OK");
              res.body.result.id.should.equal(id);
              done();
            });
      });
  });
  describe('GET for entity id(By given id)'+endpointdoc + "/for_entity/id" , function () {
      it('should return 200 OK, {error: false, message: "string", result: {entitydoc}}', function (done) {
          server
            .get(endpointdoc +"/for_entity/" + entityid)
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
  describe('PUT '+endpointdoc, function () {
  	this.timeout(10000);
  	it('should return 200 OK, {error: false, message: "OK", result: {doc}}', function (done) {
      this.timeout(10000)
      server
        .put(endpointdoc)
        .set('x-access-token', token)
     		.field('id', id)
     		.field('owner', entityid)
        .field('documentcode', 1)
        .field('documenttype_id', 1)
        .field('data', JSON.stringify({test: "test"}))
        .expect(200)
        .attach('file', 'test/i.png')
        .end( function(err, res) {
        res.body.error.should.equal(false);
        res.body.message.should.be.a("string");
        res.body.message.should.equal("OK");
        done();
        //setTimeout(done, 10000);
        });
    })
  });
describe('DELETE '+entitydoc, function () {
    it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
      server
        .delete(entitydoc)
        .set('x-access-token', token)
        .send({id: ent_id})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.be.a("string");
          done();
        });
    });
  });
describe('DELETE '+entitydoc + "/for_entity/id", function () {
    it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
      server
        .delete(entitydoc + "/for_entity/" + entityid)
        .set('x-access-token', token)
        .send({entity_id: entityid})
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
  describe('DELETE '+endpointdoc, function () {
    this.timeout(10000)
    it('should return 200 OK, {error: false, message: "string", result: []}', function (done) {
      this.timeout(10000)
      server
        .delete(endpointdoc)
        .set('x-access-token', token)
        .send({id: id})
        .expect(200)
        .end( function(err, res) {
          res.body.error.should.equal(false);
          res.body.message.should.be.a("string");
          done();
          //setTimeout(done, 10000);
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