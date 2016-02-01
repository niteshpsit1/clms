'use strict';
var debug = require('debug')('LMS:LoanDocumentModel');
/**
 *
 * loan_document model, defined as following:
 *
 * loan_document: {
 *  id:             <integer>,
 *  loan_id:        <integer>,
 *  document_id:    <integer>,
 *  um:             <string>
 *  uc:             <string>
 *  tsc:            <date>
 *  tsm:            <date>
 * }
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 20/11/2015
 */

/**
 * LoanDocument model
 */
var Boom = require('boom');
var _ = require('lodash');

var db = require('./../lib/db');

var LoanDocumentModel = db.sequelize.define('loan_document', {
  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  loan_id: {
    type: db.Sequelize.INTEGER,
    unique: 'loanDocumentUniqueConstraint'
  },
  document_id: {
    type: db.Sequelize.INTEGER,
    unique: 'loanDocumentUniqueConstraint'
  },
  uc: {
    type: db.Sequelize.STRING
  },
  um: {
    type: db.Sequelize.STRING
  }
}, {
  updatedAt: 'tsc',
  createdAt: 'tsm'
});

exports.Schema = LoanDocumentModel;


/**
 * Get all loan_document records from our loan_document model. An array of loan_document is returned.
 *
 *
 * @param:    none.
 *
 * @callback: error:    <boolean>,
 *            message:  <string>,
 *            result:   [{
 *                  id:             <integer>,
 *                  loan_id:        <integer>,
 *                  document_id:    <integer>,
 *                  um:             <string>
 *                  uc:             <string>
 *                  tsc:            <date>
 *                  tsm:            <date>
 *                       }]
 */
exports.getAllLoanDocument = function (data, callback) {
  var filter = {
    order: '"tsc" DESC'
  };
  LoanDocumentModel.findAll(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

/**
 * Get one loan_document from our loan_document model.
 * We expect id as parameter, eg. 'http://<hostname>/api/loan_document/12345'.
 * A single loan_document is returned (JSON).
 *
 *
 * @params:   id: <integer>
 *
 * @callback: error: <boolean>,
 *            message: <string>,
 *            result: {
 *                  id:             <integer>,
 *                  loan_id:        <integer>,
 *                  document_id:    <integer>,
 *                  um:             <string>
 *                  uc:             <string>
 *                  tsc:            <date>
 *                  tsm:            <date>
 *                     }
 */
exports.findById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid loanDocument'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  LoanDocumentModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('LoanDocument not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return  callback(new Boom.notFound(error.message));
  });
};

exports.findByLoanId = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid loanDocument'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {loan_id: data.id}};
  LoanDocumentModel.findOne(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.notFound('LoanDocument not found'), null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

exports.findAllDocumentIdByLoanId = function (data, callback) {
  var filter = {
    where: {loan_id: data.id},
    attributes: ['document_id']
  };
  LoanDocumentModel.findAll(filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result);
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};

/**
 * We expect id as parameter, all the other parameters are instead optional.
 * This method will update an loan_document model db record.
 *
 *
 * @param:        id:                <integer>
 *                document_id:       <integer>
 *                loan_id:           <integer>
 *                uc:                <string>
 *                um:                <string>
 *
 * @callback:     error:      <boolean>
 *                message:    <string>,
 *                results:    []
 */
exports.updateById = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid loanDocument'));
  } else if (isNaN(data.filter.id) || _.isEmpty(data.filter.id)) {
    return callback(new Boom.notFound('Invalid id'));
  } else if (_.isEmpty(data.updateData)) {
    return callback(new Boom.notFound('Invalid loanDocument'));
  }
  var filter = {where: {id: data.filter.id}};

  LoanDocumentModel.find(filter).then(function (loanDocument) {
    if (_.isEmpty(loanDocument)) {
      return callback(new Boom.notFound('LoanDocument not found'), null);
    }
    loanDocument.update(data.updateData, filter).then(function (result) {
      if (_.isEmpty(result)) {
        return callback(null, null);
      }
      return callback(null, result.dataValues);
    }).catch(function (error) {
      return callback(new Boom.notFound(error.message));
    });
  });

};


/**
 * Required id.
 *
 * This method will delete an loan_document record from the database.
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
    return callback(new Boom.notFound('Invalid loanDocument'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {id: data.id}};
  LoanDocumentModel.find(filter).then(function (loanDocument) {
    if (_.isEmpty(loanDocument)) {
      return callback(new Boom.notFound('Invalid loanDocument'), null);
    }
    loanDocument.destroy().then(function () {
      return callback(null, true);
    }).catch(function (error) {
      return callback(new Boom.notFound(error.message));
    });
  }).error(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * Required loan_id.
 *
 * This method will delete all an loan_document record from the database for given loan_id.
 *
 *
 * @param:        loan_id:    <integer>
 *
 * @callback:     error:      <boolean>,
 *                message:    <string>,
 *                results:    []
 */
exports.deleteAllLoanDocumentByLoanId = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid loanDocument'));
  } else if (_.isEmpty(data.id)) {
    return callback(new Boom.notFound('Invalid id'));
  }

  var filter = {where: {loan_id: data.id}};
  LoanDocumentModel.destroy(filter).then(function () {
    return callback(null, true);
  }).catch(function (error) {
    return callback(new Boom.notFound(error.message));
  });
};


/**
 * Parameter 'document_id', `loan_id` required, 'uc', `um` is instead optional
 *
 * This method will insert a new loan_document record into the database.
 *
 * @param:        document_id:      <integer>,
 *                loan_id:          <integer>
 *                uc:               <string>
 *                um:               <string>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid loanDocument'), null);
  }
  var newLoanDocument = data.newLoanDocument;
  if (_.isEmpty(newLoanDocument)) {
    return callback(new Boom.notFound('Invalid loanDocument'));
  } else if (isNaN(newLoanDocument.document_id) || newLoanDocument.document_id==='') {
    return callback(new Boom.notFound('Invalid documentId'));
  } else if (isNaN(newLoanDocument.loan_id) || newLoanDocument.loan_id==='') {
    return callback(new Boom.notFound('Invalid loanId'));
  }

  LoanDocumentModel.create(newLoanDocument).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(null, null);
    }
    return callback(null, result.dataValues);
  }).catch(function (error) {
    debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(new Boom.notFound(error.message));
  });
};
