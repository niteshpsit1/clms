'use strict';
/**
 * models.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 21/11/2015
 */

var debug = require('debug')('LMS:models');
var db = require('./../lib/db');

var EntityModel = require('./EntityModel');
var EntityRoleModel = require('./EntityRoleModel');
var EntityDocumentModel = require('./EntityDocumentModel');
var DocumentTypeModel = require('./DocumentTypeModel');
var LoanTypeModel = require('./LoanTypeModel');
var LoanModel = require('./LoanModel');
var LoanDocumentModel = require('./LoanDocumentModel');
var LoanEntityModel = require('./LoanEntityModel');
var DocumentModel = require('./DocumentModel');
var CollateralModel = require('./CollateralModel');
var CollateralDocumentModel = require('./CollateralDocumentModel');
var AccountModel = require('./AccountModel');
var LedgerModel = require('./LedgerModel');
var KontoxModel = require('./KontoxModel');


var PhoneHook = db.sequelize.define('phonehook', {

  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  url: {
    type: db.Sequelize.STRING,
    allowNull: false
  },

  event: {
    type: db.Sequelize.STRING,
    allowNull: false
  },

  data: {
    type: db.Sequelize.JSONB
  }
}, {
  updatedAt: 'tsc',
  createdAt: 'tsm'
});


var Visitor = db.sequelize.define('visitor', {

    id: {
      type: db.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    country: {
      type: db.Sequelize.STRING,
      allowNull: false
    },
    city: {
      type: db.Sequelize.STRING,
      allowNull: false
    },
    ip: {
      type: db.Sequelize.STRING,
      allowNull: false
    },
    browsername: {
      type: db.Sequelize.STRING,
      allowNull: false
    },
    fullversion: {
      type: db.Sequelize.STRING,
      allowNull: false
    },
    osname: {
      type: db.Sequelize.STRING,
      allowNull: false
    },
    category: {
      type: db.Sequelize.INTEGER,
      allowNull: false
    }

  },
  {
    updatedAt: 'tsc',
    createdAt: 'tsm'
  });


AccountModel.Schema.hasMany(LedgerModel.Schema, {as: 'Ledger', foreignKey: 'account_id'});

CollateralModel.Schema.belongsTo(EntityModel.Schema, {as: 'Entity', foreignKey: 'entity_id'});
CollateralModel.Schema.belongsTo(LoanModel.Schema, {as: 'Loan', foreignKey: 'loan_id'});
CollateralModel.Schema.hasMany(CollateralDocumentModel.Schema, {as: 'CollateralDocument', foreignKey: 'collateral_id'});

CollateralDocumentModel.Schema.belongsTo(DocumentModel.Schema, {as: 'Document', foreignKey: 'document_id'});
CollateralDocumentModel.Schema.belongsTo(CollateralModel.Schema, {as: 'Collateral', foreignKey: 'collateral_id'});

DocumentModel.Schema.belongsTo(DocumentTypeModel.Schema, {foreignKey: 'documenttype_id'});
DocumentModel.Schema.hasMany(EntityDocumentModel.Schema, {as: 'EntityDocument', foreignKey: 'document_id'});
DocumentModel.Schema.hasMany(LoanDocumentModel.Schema, {as: 'LoanDocument', foreignKey: 'document_id'});
DocumentModel.Schema.hasMany(CollateralDocumentModel.Schema, {as: 'CollateralDocument', foreignKey: 'document_id'});

DocumentTypeModel.Schema.hasMany(DocumentModel.Schema, {as: 'Document', foreignKey: 'documenttype_id'});

EntityModel.Schema.hasMany(EntityDocumentModel.Schema, {as: 'EntityDocument', foreignKey: 'entity_id'});
EntityModel.Schema.hasMany(LoanEntityModel.Schema, {as: 'LoanEntity', foreignKey: 'entity_id'});

EntityDocumentModel.Schema.belongsTo(DocumentModel.Schema, {as: 'Document', foreignKey: 'document_id'});
EntityDocumentModel.Schema.belongsTo(EntityModel.Schema, {as: 'Entity', foreignKey: 'entity_id'});

EntityRoleModel.Schema.hasMany(LoanEntityModel.Schema, {as: 'LoanEntity', foreignKey: 'role_id'});

EntityModel.Schema.hasMany(KontoxModel.Schema, {as: 'Kontox'});
KontoxModel.Schema.belongsTo(EntityModel.Schema, {as: 'Entity', foreignKey: 'entity_id'});

LedgerModel.Schema.belongsTo(AccountModel.Schema, {as: 'Account', foreignKey: 'account_id'});
LedgerModel.Schema.belongsTo(LoanModel.Schema, {as: 'Loan', foreignKey: 'loan_id'});

LoanModel.Schema.hasMany(CollateralModel.Schema, {as: 'Collateral', foreignKey: 'loan_id'});
LoanModel.Schema.hasMany(LoanDocumentModel.Schema, {as: 'LoanDocument', foreignKey: 'loan_id'});
LoanModel.Schema.hasMany(LoanEntityModel.Schema, {as: 'LoanEntity', foreignKey: 'loan_id'});
LoanModel.Schema.hasMany(LedgerModel.Schema, {as: 'Ledger', foreignKey: 'loan_id'});
LoanModel.Schema.belongsTo(LoanTypeModel.Schema, {as: 'LoanType', foreignKey: 'loan_type_id'});

LoanEntityModel.Schema.belongsTo(EntityRoleModel.Schema, {as: 'EntityRole', foreignKey: 'role_id'});
LoanEntityModel.Schema.belongsTo(LoanModel.Schema, {as: 'Loan', foreignKey: 'loan_id'});
LoanEntityModel.Schema.belongsTo(EntityModel.Schema, {as: 'Entity', foreignKey: 'entity_id'});

LoanDocumentModel.Schema.belongsTo(LoanModel.Schema, {as: 'Loan', foreignKey: 'loan_id'});
LoanDocumentModel.Schema.belongsTo(DocumentModel.Schema, {as: 'Document', foreignKey: 'document_id'});

LoanTypeModel.Schema.hasMany(LoanModel.Schema, {as: 'Loan', foreignKey: 'loan_type_id'});

exports.PhoneHook = PhoneHook;
exports.Visitor = Visitor;