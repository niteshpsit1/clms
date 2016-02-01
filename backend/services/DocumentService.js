'use strict';
var debug = require('debug')('LMS:DocumentService');

var Boom = require('boom');
var _ = require('lodash');
var shortid = require('shortid');

var DocumentModel = require('../models/DocumentModel');
var EntityModel = require('../models/EntityModel');
var EntityDocumentModel = require('../models/EntityDocumentModel');
var LoanDocumentModel = require('../models/LoanDocumentModel');
var DocumentTypeModel = require('../models/DocumentTypeModel');
var CollateralModel = require('../models/CollateralModel');
var CollateralDocumentModel = require('../models/CollateralDocumentModel');
var LoanModel = require('../models/LoanModel');

exports.validateUpdateDocumentParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid document'));
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  } else if (isNaN(params.documenttype_id) || params.documenttype_id === '') {
    return next(new Boom.notFound('Invalid documentTypeId'));
  }
  return next();
};

exports.validateDocumentParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid document'));
  } else if (isNaN(params.documenttype_id) || params.documenttype_id === '') {
    return next(new Boom.notFound('Invalid documentTypeId'));
  } else if (_.isEmpty(req.file)) {
    return next(new Boom.notFound('Invalid file'));
  } else if (req.file.size === 0) {
    return next(new Boom.notFound('Invalid file'));
  }
  return next();
};

exports.validateDocumentInsertAndRelateParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid document'));
  } else if (isNaN(params.documenttype_id) || params.documenttype_id === '') {
    return next(new Boom.notFound('Invalid documentTypeId'));
  } else if (isNaN(params.entity_id) || params.entity_id === '') {
    return next(new Boom.notFound('Invalid entityId'));
  } else if (isNaN(params.loan_id) || params.loan_id === '') {
    return next(new Boom.notFound('Invalid loanId'));
  } else if (isNaN(params.collateral_id) || params.collateral_id === '') {
    return next(new Boom.notFound('Invalid collateralId'));
  } else if (_.isEmpty(req.file)) {
    return next(new Boom.notFound('Invalid file'));
  } else if (req.file.size === 0) {
    return next(new Boom.notFound('Invalid file'));
  }
  return next();
};

exports.getAll = function (req, res, next) {
  debug('GET DocumentModel service called.');
  DocumentModel.getAllDocument({}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.documentStore = result;
    return next();
  });
};

exports.searchById = function (req, res, next) {
  debug('GET DocumentModel by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  }
  DocumentModel.findById({id: params.id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.documentStore = result;
    return next();
  });
};

exports.updateById = function (req, res, next) {
  debug('PUT DocumentModel service called.');

  var params = req.body;

  var data = {
    documentcode: params.documentcode,
    documenttype_id: params.documenttype_id,
    data: params.data,
    um: req.user.id || ''
  };
  data = _.pick(params, 'documentcode', 'documenttype_id', 'data');
  var filter = {
    id: params.id
  };

  var documentFile = req.file;

  DocumentModel.updateById({updateData: data, filter: filter, documentFile: documentFile}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.documentStore = result;
    return next();
  });
};

exports.deleteById = function (req, res, next) {
  debug('DELETE DocumentModel service called.');

  var params = _.merge(req.params, req.body);

  if (_.isEmpty(req.session.documentStore)) {
    return next(new Boom.notFound('Document not found'), null);
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid document'), null);
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'), null);
  }
  DocumentModel.deleteById({id: params.id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.documentStore = {};
    return next();
  });
};

exports.searchDocumentTypeById = function (req, res, next) {
  debug('GET DocumentTypeModel by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.documenttype_id) || params.documenttype_id === '') {
    return next(new Boom.notFound('Invalid documentTypeId'));
  }
  DocumentTypeModel.findById({id: params.documenttype_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (_.isEmpty(result)) {
      return next(new Boom.notFound('DocumentType not found'), null);
    }
    return next();
  });
};

exports.newDocument = function (req, res, next) {
  debug('POST DocumentModel service called.');

  var params = req.body;
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid documentType'), null);
  }

  var newDocument = {
    filename: shortid.generate() + '-' + req.file.originalname,
    mime: req.file.mimetype,
    documentcode: params.documentcode,
    documenttype_id: params.documenttype_id,
    data: params.data || {},
    um: req.user.id || '',
    uc: req.user.id || ''
  };

  var documentFile = req.file;
  DocumentModel.insert({newDocument: newDocument, documentFile: documentFile}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.documentStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid document'));
  });

};

exports.searchEntityById = function (req, res, next) {
  debug('GET Entity by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.entity_id) || params.entity_id === '') {
    return next(new Boom.notFound('Invalid entityId'));
  }
  EntityModel.findById({id: params.entity_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (_.isEmpty(result)) {
      return next(new Boom.notFound('Entity not found'));
    }
    return next();
  });
};

exports.searchCollateralById = function (req, res, next) {
  debug('GET Entity by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.collateral_id) || params.collateral_id === '') {
    return next(new Boom.notFound('Invalid collateralId'));
  }
  CollateralModel.findById({id: params.collateral_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (_.isEmpty(result)) {
      return next(new Boom.notFound('Collateral not found'));
    }
    return next();
  });
};

exports.searchLoanById = function (req, res, next) {
  debug('GET Loan by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.loan_id) || params.loan_id === '') {
    return next(new Boom.notFound('Invalid loanId'));
  }

  LoanModel.findByLoanId({loan_id: params.loan_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (_.isEmpty(result)) {
      return next(new Boom.notFound('Loan not found'));
    }
    return next();
  });
};

exports.searchAllEntityDocumentByEntityId = function (req, res, next) {
  debug('GET AllEntityDocument by id service called.');
  var params = _.merge(req.params, req.body);

  EntityDocumentModel.findAllDocumentIdByEntityId({id: params.entity_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (_.isEmpty(result)) {
      return next(new Boom.notFound('No document found related to entity exist'));
    }
    req.session.EntityDocumentStore = result;
    return next();
  });
};

exports.getDocumentForEntity = function (req, res, next) {
  debug('GET DocumentModel for entity_id service called.');
  if (_.isEmpty(req.session.EntityDocumentStore)) {
    return next(new Boom.notFound('No document found related to entity exist'));
  }

  DocumentModel.getForEntity({EntityDocumentStore: req.session.EntityDocumentStore}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.documentStore = result;
    req.session.EntityDocumentStore = {};
    return next();
  });
};

exports.searchAllLoanDocumentByLoanId = function (req, res, next) {
  debug('GET AllEntityDocument by id service called.');
  var params = _.merge(req.params, req.body);

  LoanDocumentModel.findAllDocumentIdByLoanId({id: params.loan_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (_.isEmpty(result)) {
      return next(new Boom.notFound('No document found related to loan exist'));
    }
    req.session.LoanDocumentStore = result;
    return next();
  });
};

exports.getDocumentForLoan = function (req, res, next) {
  debug('GET DocumentModel for loan_id service called.');

  if (_.isEmpty(req.session.LoanDocumentStore)) {
    return next(new Boom.notFound('No document found related to loan exist'));
  }

  DocumentModel.getForLoan({LoanDocumentStore: req.session.LoanDocumentStore}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.documentStore = result;
    req.session.LoanDocumentStore = {};
    return next();
  });
};

exports.searchAllCollateralDocumentByCollateralId = function (req, res, next) {
  debug('GET AllEntityDocument by id service called.');
  var params = _.merge(req.params, req.body);

  CollateralDocumentModel.findAllDocumentIdByCollateralId({id: params.collateral_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (_.isEmpty(result)) {
      return next(new Boom.notFound('No document found related to collateral exist'));
    }
    req.session.CollateralDocumentStore = result;
    return next();
  });
};

exports.getDocumentForCollateral = function (req, res, next) {
  debug('GET DocumentModel for collateral_id service called.');

  if (_.isEmpty(req.session.CollateralDocumentStore)) {
    return next(new Boom.notFound('No document found related to collateral exist'));
  }

  DocumentModel.getForCollateral({CollateralDocumentStore: req.session.CollateralDocumentStore}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.documentStore = result;
    req.session.CollateralDocumentStore = {};
    return next();
  });
};

exports.addUploadAndRelate = function (req, res, next) {
  debug('POST DocumentModel and relate service called.');
  var params = _.merge(req.params, req.body);

  var newDocument = {
    filename: shortid.generate() + '-' + req.file.originalname,
    mime: req.file.mimetype,
    documentcode: params.documentcode,
    documenttype_id: params.documenttype_id,
    data: req.body.data,
    um: req.user.id || '',
    uc: req.user.id || '',
    EntityDocument: {
      entity_id: params.entity_id,
      um: req.user.id || '',
      uc: req.user.id || ''
    },
    CollateralDocument: {
      collateral_id: params.collateral_id,
      um: req.user.id || '',
      uc: req.user.id || ''
    },
    LoanDocument: {
      loan_id: params.loan_id,
      um: req.user.id || '',
      uc: req.user.id || ''
    }
  };

  var documentFile = req.file;
  DocumentModel.insertAndRelate({newDocument: newDocument, documentFile: documentFile}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.documentStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid document'));
  });
};

exports.downloadDocument = function (req, res, next) {
  debug('GET download document service called.');
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'));
  }

  DocumentModel.downloadDocument(req, res, next);
};