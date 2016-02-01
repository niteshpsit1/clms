'use strict';
/**
 * document data model, defined as following:
 *
 * document: {
 *  id:               <integer>,
 *  filename:         <string>,
 *  documentcode:     <string>,
 *  documenttype_id:  <integer>,
 *  data:             <json>,
 *  tsc:              <date>,
 *  tsm:              <date>,
 *  uc:               <string>,
 *  um:               <string>
 * }
 *
 *
 * @author: Daniele Gazzelloni <daniele@danielegazzelloni.com>
 * @created: 27/10/2015
 ********************************************************************/
var debug = require('debug')('LMS:DocumentModel');

var _ = require('lodash');
var Boom = require('boom');
var shortid = require('shortid');
var mime = require('mime');

var db = require('./../lib/db');
var config = require('./../../config/backend.config');
var awsHelper = require('./../lib/helpers/aws');
var s3 = awsHelper.s3;
var S3Async = awsHelper.S3Async;

var EntityDocumentModel = require('./EntityDocumentModel');
var CollateralDocumentModel = require('./CollateralDocumentModel');
var LoanDocumentModel = require('./LoanDocumentModel');

var DocumentModel = db.sequelize.define('document', {

    id: {
      type: db.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    filename: {
      type: db.Sequelize.STRING,
      allowNull: true
    },

    mime: {
      type: db.Sequelize.STRING
    },

    data: {
      type: db.Sequelize.JSONB
    },

    documentcode: {
      type: db.Sequelize.STRING,
      allowNull: true
    },

    documenttype_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false
    },

    uc: {
      type: db.Sequelize.STRING
    },

    um: {
      type: db.Sequelize.STRING
    }

  },
  {
    updatedAt: 'tsc',
    createdAt: 'tsm'
  });

exports.Schema = DocumentModel;


/**
 * Get all documents fields from our document model except document content (file data).
 * That's because this method is used for getting file names and info, not for retrieving files data.
 *
 * An array of documents is returned.
 *
 *
 * @param:    none.
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: [{
 *                         id: integer,
 *                         filename: string,
 *                         documentcode: string,
 *                         documenttype_id: integer,
 *                         data: json,
 *                         url: string,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                     }]
 */
exports.getAllDocument = function (data, callback) {
  //Select all documents, excluding the `file` field (BLOB)
  var filter = {
    order: 'tsc DESC'
  };

  DocumentModel.findAll(filter).then(function (data) {
    if (_.isEmpty(data)) {
      return callback(null, null);
    }

    var documents = [];
    _.map(data, function (result) {
      var newDocument = {};
      var params = {Bucket: config.aws.s3Bucket, Key: result['filename'], Expires: config.session.expiry * 60};
      var url = s3.getSignedUrl('getObject', params);
      newDocument.id = result.id;
      newDocument.filename = result.filename;
      newDocument.documentcode = result.documentcode;
      newDocument.documenttype_id = result.documenttype_id;
      newDocument.data = result.data;
      newDocument.url = url;
      newDocument.tsc = result.tsc;
      newDocument.tsm = result.tsm;
      newDocument.uc = result.uc;
      newDocument.um = result.um;
      documents.push(newDocument);
      return result;
    });

    return callback(null, documents);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * Get one document from our document model.
 * We expect id as parameter, eg. 'http://<hostname>/documents/123452313'.
 * If the id is provided a single document is returned (JSON).
 *
 *
 * @params:   id: <integer>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: {
 *                         id: integer,
 *                         filename: string,
 *                         documentcode: string,
 *                         documenttype_id: integer,
 *                         data: json,
 *                         url: string,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                     }
 */

exports.findById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid document'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  DocumentModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('Document not found'), null);
    }
    var newDocument = {};
    var params = {Bucket: config.aws.s3Bucket, Key: result['filename'], Expires: config.session.expiry * 60};
    var url = s3.getSignedUrl('getObject', params);
    newDocument.id = result.id;
    newDocument.filename = result.filename;
    newDocument.documentcode = result.documentcode;
    newDocument.documenttype_id = result.documenttype_id;
    newDocument.data = result.data;
    newDocument.url = url;
    newDocument.tsc = result.tsc;
    newDocument.tsm = result.tsm;
    newDocument.uc = result.uc;
    newDocument.um = result.um;
    return callback(null, newDocument);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * We expect id as parameter, all the other parameters are instead optional.
 * This method will update a document model record.
 *
 *
 * @param:        id:               <integer>,
 *                file:             <file>,
 *                documentcode:     <string>,
 *                documenttype_id:  <integer>
 *
 * @callback:     error:      <boolean>
 *                message:    <string>,
 *                results:    []
 */

exports.updateById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid document'));
  } else if (isNaN(data.filter.id) || _.isEmpty(data.filter.id)) {
    return callback(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(data.updateData)) {
    return callback(new Boom.notFound('Invalid document'));
  }
  var filter = {where: {id: data.filter.id}};

  db.sequelize.transaction(function (t) {

    return DocumentModel.find(filter).then(function (document) {
      if (_.isEmpty(document)) {
        return (new Boom.notFound('Document not found'));
      } else {
        if (data.documentFile) {
          var file = data.documentFile;
          data.updateData.filename = shortid.generate() + '-' + file.originalname;
          data.updateData.mime = mime.lookup(file.mimetype);

          return S3Async.putObjectAsync({
            ACL: 'private', //'public-read',
            Bucket: config.aws.s3Bucket,
            Key: data.updateData.filename,
            ContentDisposition: 'attachment',
            Body: file.buffer,
            ContentType: mime.lookup(file.originalname)
          }).then(function () {
            return document.update(data.updateData, filter, {transaction: t});
          });
        } else {
          return document.update(data.updateData, filter, {transaction: t});
        }
      }
    });

  }).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });

};


/**
 * datauired id.
 *
 * This method will delete a document record from the database.
 *
 *
 * @param:        id:         <integer>
 *
 * @callback:     error:      <boolean>,
 *                message:    <string>,
 *                results:    []
 */
exports.deleteById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid document'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  DocumentModel.find(filter).then(function (document) {
    if (_.isEmpty(document)) {
      return callback(new Boom.notFound('Document not found'), null);
    }
    var params = {
      Bucket: config.aws.s3Bucket,
      Key: document.filename
    };
    S3Async.deleteObjectAsync(params).then(function () {
      document.destroy().then(function () {
        return callback(null, true);
      }).catch(function (error) {
        console.log('error: ', error);
        return callback(new Boom.notFound(error.message));
      });
    }).catch(function (error) {
      return callback(new Boom.notFound(error.message));
    });
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });

};


/**
 * All parameters datauired except for documentcode (which is optional)
 *
 * This method will insert a new document record into the database.
 *
 * @param:        documentcode:     <string>,
 *                documenttype_id:  <integer>,
 *                file:             <file>,
 *                uc:               <string>,
 *                um:               <string>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */

exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid document'), null);
  } else if (_.isEmpty(data.newDocument)) {
    return callback(new Boom.notFound('Invalid document'), null);
  }else if (_.isEmpty(data.documentFile)) {
    return callback(new Boom.notFound('Invalid document file'), null);
  }

  var newDocument = data.newDocument;
  db.sequelize.transaction(function (t) {
    return S3Async.putObjectAsync({
      ACL: 'private', //'public-read',
      Bucket: config.aws.s3Bucket,
      Key: newDocument.filename,
      ContentDisposition: 'attachment',
      Body: data.documentFile.buffer,
      ContentType: mime.lookup(data.documentFile.originalname)
    }).then(function () {
      return DocumentModel.create(newDocument, {transaction: t}).then(function (result) {
        return result;
      });
    });
  }).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * Get documents for defined entity from our document model.
 * We expect entity_id as parameter, eg. 'http://<hostname>/api/documents/for_entity/:entity_id'.
 * If the id is provided a single document is returned (JSON).
 *
 *
 * @params:   entity_id: <integer>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: [{
 *                         id: integer,
 *                         filename: string,
 *                         documentcode: string,
 *                         documenttype_id: integer,
 *                         data: json,
 *                         url: string
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                     }]
 */

exports.getForEntity = function (data, callback) {
  if (_.isEmpty(data.EntityDocumentStore)) {
    return callback(new Boom.notFound('No document found related to entity exist'));
  }

  var documentIds = _.map(data.EntityDocumentStore, function (data) {
    return data['document_id'];
  });

  DocumentModel.findAll({where: {id: {$in: documentIds}}}).then(function (data) {
    var documents = [];
    _.map(data, function (result) {
      var newDocument = {};
      var params = {
        Bucket: config.aws.s3Bucket,
        Key: result['filename'],
        Expires: config.session.expiry * 60
      };
      var url = s3.getSignedUrl('getObject', params);
      newDocument.id = result.id;
      newDocument.filename = result.filename;
      newDocument.documentcode = result.documentcode;
      newDocument.documenttype_id = result.documenttype_id;
      newDocument.data = result.data;
      newDocument.url = url;
      newDocument.tsc = result.tsc;
      newDocument.tsm = result.tsm;
      newDocument.uc = result.uc;
      newDocument.um = result.um;
      documents.push(newDocument);
      return result;
    });

    return callback(null, documents);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });

};


/**
 * Get documents for defined loan from our document model.
 * We expect loan_id as parameter, eg. 'http://<hostname>/api/documents/for_loan/:loan_id'.
 * If the id is provided a single document is returned (JSON).
 *
 *
 * @params:   loan_id: <integer>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: [{
 *                         id: integer,
 *                         filename: string,
 *                         documentcode: string,
 *                         documenttype_id: integer,
 *                         data: json,
 *                         url: string,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                     }]
 */

exports.getForLoan = function (data, callback) {

  if (_.isEmpty(data.LoanDocumentStore)) {
    return callback(new Boom.notFound('No document found related to entity exist'));
  }

  var documentIds = _.map(data.LoanDocumentStore, function (data) {
    return data['document_id'];
  });

  DocumentModel.findAll({where: {id: {$in: documentIds}}}).then(function (data) {
    var documents = [];
    _.map(data, function (result) {
      var newDocument = {};
      var params = {
        Bucket: config.aws.s3Bucket,
        Key: result['filename'],
        Expires: config.session.expiry * 60
      };
      var url = s3.getSignedUrl('getObject', params);
      newDocument.id = result.id;
      newDocument.filename = result.filename;
      newDocument.documentcode = result.documentcode;
      newDocument.documenttype_id = result.documenttype_id;
      newDocument.data = result.data;
      newDocument.url = url;
      newDocument.tsc = result.tsc;
      newDocument.tsm = result.tsm;
      newDocument.uc = result.uc;
      newDocument.um = result.um;
      documents.push(newDocument);
      return result;
    });
    return callback(null, documents);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * Get documents for defined collateral from our document model.
 * We expect loan_id as parameter, eg. 'http://<hostname>/api/documents/for_collateral/:collateral_id'.
 * If the id is provided a single document is returned (JSON).
 *
 *
 * @params:   loan_id: <integer>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: {
 *                         id: integer,
 *                         filename: string,
 *                         documentcode: string,
 *                         documenttype_id: integer,
 *                         data: json,
 *                         url: string,
 *                         tsc: date,
 *                         tsm: date,
 *                         uc: string,
 *                         um: string
 *                     }
 */

exports.getForCollateral = function (data, callback) {
  if (_.isEmpty(data.CollateralDocumentStore)) {
    return callback(new Boom.notFound('No document found related to collateral exist'));
  }

  var documentIds = _.map(data.CollateralDocumentStore, function (data) {
    return data['document_id'];
  });

  DocumentModel.findAll({where: {id: {$in: documentIds}}}).then(function (data) {
    var documents = [];
    _.map(data, function (result) {
      var newDocument = {};
      var params = {
        Bucket: config.aws.s3Bucket,
        Key: result['filename'],
        Expires: config.session.expiry * 60
      };
      var url = s3.getSignedUrl('getObject', params);
      newDocument.id = result.id;
      newDocument.filename = result.filename;
      newDocument.documentcode = result.documentcode;
      newDocument.documenttype_id = result.documenttype_id;
      newDocument.data = result.data;
      newDocument.url = url;
      newDocument.tsc = result.tsc;
      newDocument.tsm = result.tsm;
      newDocument.uc = result.uc;
      newDocument.um = result.um;
      documents.push(newDocument);
      return result;
    });
    return callback(null, documents);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * All parameters datauired except for documentcode (which is optional)
 *
 * This method will insert a new document record into the database.
 *
 * @param:        documentcode:     <string>,
 *                documenttype_id:  <integer>,
 *                entity_id:        <integer>,
 *                loan_id:          <integer>,
 *                collateral_id:    <integer>,
 *                file:             <file>,
 *                uc:               <string>,
 *                um:               <string>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */

exports.insertAndRelate = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid document'), null);
  } else if (_.isEmpty(data.newDocument)) {
    return callback(new Boom.notFound('Invalid document'), null);
  }

  db.sequelize.transaction(function (t) {
    return S3Async.putObjectAsync({
      ACL: 'private', //'public-read',
      Bucket: config.aws.s3Bucket,
      Key: data.newDocument.filename,
      Body: data.documentFile.buffer,
      ContentDisposition: 'attachment',
      ContentType: mime.lookup(data.documentFile.originalname)
    }).then(function () {
      return DocumentModel.create(data.newDocument, {
        include: [
          {model: EntityDocumentModel.Schema, as: 'EntityDocument'},
          {model: CollateralDocumentModel.Schema, as: 'CollateralDocument'},
          {model: LoanDocumentModel.Schema, as: 'LoanDocument'}
        ], transaction: t
      }).then(function (result) {
        return result;
      });
    });
  }).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

exports.downloadDocument = function (data, callback) {
  var recStream = s3.getObject({
    Bucket: config.aws.s3Bucket,
    Key: data.params.name
  }).createReadStream();

  recStream.pipe(callback);
};
