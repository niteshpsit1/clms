'use strict';
/**
 * dummy-default.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 21/11/2015
 */
var debug = require('debug')('LMS:Dummy-Data');

var Faker = require('faker2');
var bcrypt = require('bcrypt-nodejs');
//var _ = require('lodash');
var shortid = require('shortid');
var async = require('async');
//var Promise = require('bluebird');
var mime = require('mime');

var UserModel = require('./../models/UserModel');
var EntityModel = require('./../models/EntityModel');
var EntityRoleModel = require('./../models/EntityRoleModel');
//var EntityDocumentModel = require('./../models/EntityDocumentModel');
var DocumentTypeModel = require('./../models/DocumentTypeModel');
var LoanTypeModel = require('./../models/LoanTypeModel');
var DocumentModel = require('./../models/DocumentModel');
var LoanModel = require('./../models/LoanModel');
var CollateralModel = require('./../models/CollateralModel');
//var CollateralDocumentModel = require('./../models/CollateralDocumentModel');
//var LoanEntityModel = require('./../models/LoanEntityModel');
//var LoanDocumentModel = require('./../models/LoanDocumentModel');

module.exports = function () {

  async.waterfall([
      createUser,
      createEntity,
      createEntityRole,
      createDocumentType,
      createLoanType,
      createLoan,
      createCollateral,
      createDocument
    ],
    function (err) {
      if (err) {
        debug('Error: ', err.message);
      } else {
        debug('Dummy data Inserted');
      }
    }
  );
};

function createUser(callback) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync('123456789', salt);

  var objUser = {
    name: Faker.Name.findName(),
    email: 'faker_' + Faker.Internet.email(),
    age: Faker.Helpers.randomNumber(50),
    password: hash
  };

  UserModel.insert({newUser: objUser}, function () {
    return callback();
  });
}


function createEntity(callback) {


  var entity1 = {};
  var entity2 = {};

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync('123456789', salt);

  // for user
  var name = Faker.Name.findName() + ' Faker';
  var compnay = Faker.Company.companyName();
  entity1.idnumber = shortid.generate();
  entity1.name = name;
  entity1.dba = compnay;
  entity1.individual = true;
  entity1.data = {};

  // for company
  entity2.idnumber = shortid.generate();
  entity2.name = name;
  entity2.dba = compnay;
  entity2.individual = false;
  entity2.data = {
    email: 'faker_' + Faker.Internet.email(),
    rfc: Faker.Internet.domainWord(),
    password: hash,
    rfc_token: '123456789'
  };
  EntityModel.insert({newEntity1: entity1, newEntity2: entity2}, function (error, result) {
    //console.log('Success insert');
    return callback(error, result);
  });

}


function createLoan(entity, role, doctype, loanType, callback) {

  var loan = {};
  loan.loan_type_id = loanType.id;
  loan.principal = parseInt(Faker.Helpers.randomNumber(100) * 10000);
  loan.loanterm = Faker.Helpers.randomNumber(50);
  loan.interestrate = Faker.Helpers.randomNumber(15) + '%';
  loan.startingdate = new Date();

  var loanEntity = {
    entity_id: entity.id,
    role_id: role.id
  };

  loan.LoanEntity = loanEntity;
  LoanModel.insert({newLoan: loan}, function (error, result) {
    return callback(error, entity, role, doctype, loanType, result);
  });
}

function createLoanType(entity, role, doctype, callback) {
  // SMB Mortgage Loan

  var loan_type = {};
  loan_type.code = Faker.Internet.domainWord();
  loan_type.payment_cycle = Faker.Helpers.randomNumber(50);
  loan_type.loan_system = Faker.Lorem.words()[0];
  loan_type.description = 'Loan Type ' + Faker.Lorem.sentence();

  LoanTypeModel.insert({newLoanType: loan_type}, function (error, result) {
    return callback(error, entity, role, doctype, result);
  });
}

function createEntityRole(entity, callback) {
  var entityRole = {};
  entityRole.name = Faker.Lorem.words()[0];
  entityRole.description = 'Entity Role Type ' + Faker.Lorem.sentence();

  EntityRoleModel.insert({newEntityRole: entityRole}, function (error, result) {
    return callback(error, entity, result);
  });
}

function createDocumentType(entity, role, callback) {

  var documentType = {};

  documentType.code = Faker.Internet.domainWord();
  documentType.description = 'Doc Type ' + Faker.Lorem.sentence();
  documentType.validationrequirements = 'YES';

  DocumentTypeModel.insert({newDocumentType: documentType}, function (error, result) {
    return callback(error, entity, role, result);
  });

}

function createCollateral(entity, role, doctype, loanType, loan, callback) {

  var collateral = {};

  collateral.name = Faker.Lorem.words()[0] + '-' + Faker.Lorem.words()[1];
  collateral.valuation = parseInt(Faker.Helpers.randomNumber(100) * 10000);
  collateral.data = {};
  collateral.entity_id = entity.id;
  collateral.loan_id = loan.id;
  CollateralModel.insert({newCollateral: collateral}, function (error, result) {
    return callback(error, entity, role, doctype, loanType, loan, result);
  });
}


function createDocument(entity, role, doctype, loanType, loan, collateral, callback) {

  var mimes = ['pdf', 'jpg', 'jpeg', 'png', 'bmp', 'docx', 'doc', 'xlsx', 'xls', 'txt'];
  var document = {};
  var file = {};
  var documentFile = shortid.generate() + '-' + Faker.Internet.domainWord() + '.' + mimes[Faker.Helpers.randomNumber(9)];
  file.documentFile = documentFile;
  file.originalname = '';
  file.buffer = '';

  document.data = {};
  document.filename = documentFile;
  document.mime = mime.lookup(documentFile);
  document.documentcode = Faker.Lorem.words()[0];
  document.documenttype_id = doctype.id;

  // Create the entity-document tables relationship
  document.EntityDocument = {
    entity_id: entity.id
  };

  // Create the collateral-document tables relationship
  document.CollateralDocument = {
    collateral_id: collateral.id
  };

  //Create the loan_document tables relationship
  document.LoanDocument = {
    loan_id: loan.id
  };

  DocumentModel.insert({newDocument: document, documentFile: file}, function (error, result) {
    return callback(error, entity, role, doctype, loanType, loan, collateral, result);
  });
}