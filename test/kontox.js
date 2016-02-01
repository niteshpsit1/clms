/*/**
 * Mocha tests for API:  "/"
 *
 * @author deepak kumar <deepak.kumar@daffodilsw.com>
 * @created 04/01/2016
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
var endpointkontox = "/api/kontox";
var endpoint = "/api/entities";


var server = request.agent("http://localhost:"+config.server.port);
var sessionserver = request.agent("https://signin.kontomatik.com");


describe('*** KONTOX APIs:', function () {
var token , id, email, signid, sessionId , sessionIdSignature, iban
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
    it('should return 200 OK, {error: false, message: "OK", result: [{entities}]}', function (done) {
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
  describe('POST  in kontomatik api for login for session', function () {
    this.timeout(10000)
    it('should return sessionId ,sessionIdSignature, {sessionId: sessionId, sessionIdSignature: sessionIdSignature, credentialsMetadata: []}', function (done) {
      this.timeout(10000)
      sessionserver
        .post("/session.json")
        .set('Content-Type', 'application/json; charset=utf-8')
        .send({"target":"Alior","client":"credijusto-test","ownerExternalId":""})
        .end( function(err, res) {
          sessionId = res.body.sessionId;
          sessionIdSignature = res.body.sessionIdSignature;
          done();
        });
    });
  });
   describe('POST  in kontomatik api for login', function () {
    this.timeout(10000)
    it('should return credentialsMetadata, {credentialsMetadata: [{name:name,kind:kind,supported:supported,asterisked:true,mask:{}}]}', function (done) {
      this.timeout(10000)
      sessionserver
        .post("/enter-credential.json")
        .set('Content-Type', 'application/json; charset=utf-8')
        .send({"client":"credijusto-test","credentials":[{"kind":"STATIC_LOGIN","value":"test"}],"sessionId":sessionId,"sessionIdSignature":sessionIdSignature})
        .end( function(err, res) {
         done();
        });
    });
  });
   describe('POST  in kontomatik api for login', function () {
    this.timeout(10000)
    it('should return credentialsMetadata, {"credentialsMetadata":[]}', function (done) {
      this.timeout(10000)
      sessionserver
        .post("/enter-credential.json")
        .set('Content-Type', 'application/json; charset=utf-8')
        .send({"client":"credijusto-test","credentials":[{"kind":"STATIC_PASSWORD","value":"et2"}],"sessionId":sessionId,"sessionIdSignature":sessionIdSignature})
        .end( function(err, res) {
        done();
        });
    });
  });
  describe('POST  kontox'+ endpointkontox, function () {
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      server
        .post(endpointkontox)
        .set('x-access-token', token)
        .send({sessionId :"1225229", sessionIdSignature : "067ca167e5f31e28cd5cea779bf869b2c6f935eeb33364b41c29b31bb173909f",
         entity_id : id, fast : false})
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
  describe('POST  (import-accounts)'+ endpointkontox + "/import-accounts", function () {
    this.timeout(20000)
    it('should return 200 OK, {error: false, message: "OK", result: [{accounts}]}', function (done) {
      this.timeout(20000)
      server
        .post(endpointkontox + "/import-accounts")
        .set('x-access-token', token)
        .send({sessionId :sessionId, sessionIdSignature :sessionIdSignature, fast : false})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
          iban = res.body.result[0].iban;
          res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string"); 
          res.body.result.should.be.instanceof(Array);
          done();
        });
    });
  });
  describe('POST  (import-account-transactions)'+ endpointkontox + "/import-account-transactions", function () {
    this.timeout(30000)
    it('should return 200 OK, {error: false, message: "OK", result: [{transactions}]}', function (done) {
      this.timeout(30000)
      server
        .post(endpointkontox + "/import-account-transactions")
        .set('x-access-token', token)
        .send({sessionId : sessionId, sessionIdSignature : sessionIdSignature, since: "2013-11-01", iban :iban, fast : false})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
        	res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string"); 
          res.body.result.should.be.instanceof(Array);
          done();
        });
    });
  });
  describe('POST  (import-owners)'+ endpointkontox + "/import-owners", function () {
    this.timeout(20000)
    it('should return 200 OK, {error: false, message: "OK", result: [{owners}]}', function (done) {
      this.timeout(20000)
      server
        .post(endpointkontox + "/import-owners")
        .set('x-access-token', token)
        .send({sessionId : sessionId, sessionIdSignature : sessionIdSignature})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
        	res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string"); 
          res.body.result.should.be.instanceof(Array);
          done();
        });
    });
  });

  describe('GET (aggregates by ownerExternalId)'+ endpointkontox + "/aggregates", function () {
	  this.timeout(20000)
	  it('should return 200 OK, {error: false, message: "string", result: [{aggregates}]}', function (done) {
      this.timeout(20000)
      server
        .get(endpointkontox + "/aggregates?ownerExternalId=" + 's83c3')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
        /*res.body.error.should.equal(false);
          res.body.message.should.be.a("string");
        */
        done();
        });
    });
  });
  describe('GET (account info by entity ID)' + endpointkontox, function() {
  	this.timeout(10000)
  	it('should return ok, { error:false, message:"string, result :[{account_info}]', function(done){
  		this.timeout(10000)
  		server
  			.get(endpointkontox + "/account_info/for_entity/" + id)
  			.set('x-access-token', token)
  			.expect('Content-Type', /json/)
  			.expect(200)
  			.end(function(err , res){
  				res.body.error.should.equal(false);
          res.body.message.should.be.a("string");
          res.body.message.should.equal('OK');
          done();
  			});
  	})
  });
 describe('POST  (sign out)'+ endpointkontox + "/sign-out", function () {
    this.timeout(20000)
    it('should return 200 OK, {error: false, message: "OK", result: []}', function (done) {
      this.timeout(20000)
      server
        .post(endpointkontox + "/sign-out")
        .set('x-access-token', token)
        .send({sessionId : sessionId, sessionIdSignature : sessionIdSignature})
        .expect('Content-Type', /json/)
        .expect(200)
        .end( function(err, res) {
        /*res.body.error.should.equal(false);
          res.body.message.should.equal("OK");
          res.body.message.should.be.a("string"); 
          */
        done();
        });
    });
  });
  describe('Delete '+endpoint, function () {
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