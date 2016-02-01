'use strict';
var debug = require('debug')('LMS:LoanService');

var Boom = require('boom');
var _ = require('lodash');

var LoanModel = require('../models/LoanModel');
var LoanTypeModel = require('../models/LoanTypeModel');
var EntityModel = require('../models/EntityModel');
var EntityRoleModel = require('../models/EntityRoleModel');
var LoanEntityModel = require('../models/LoanEntityModel');

exports.validateUpdateLoanParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid loan'));
  } else if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  } else if (isNaN(params.loan_type_id) || params.loan_type_id === '') {
    return next(new Boom.notFound('Invalid loanTypeId'));
  } else if (_.isEmpty(params.principal)) {
    return next(new Boom.notFound('Invalid principal'));
  } else if (_.isEmpty(params.loanterm)) {
    return next(new Boom.notFound('Invalid loanterm'));
  } else if (_.isEmpty(params.interestrate)) {
    return next(new Boom.notFound('Invalid interestrate'));
  } else if (isNaN(params.role_id) || params.role_id === '') {
    return next(new Boom.notFound('Invalid roleId'));
  }
  return next();
};

exports.validateLoanParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid loan'), null);
  } else if (isNaN(params.loan_type_id) || params.loan_type_id === '') {
    return next(new Boom.notFound('Invalid loanTypeId'));
  } else if (_.isEmpty(params.principal)) {
    return next(new Boom.notFound('Invalid principal'));
  } else if (_.isEmpty(params.loanterm)) {
    return next(new Boom.notFound('Invalid loanterm'));
  } else if (_.isEmpty(params.interestrate)) {
    return next(new Boom.notFound('Invalid interestrate'));
  } else if (isNaN(params.role_id) || params.role_id === '') {
    return next(new Boom.notFound('Invalid roleId'));
  } else if (isNaN(params.entity_id) || params.entity_id === '') {
    return next(new Boom.notFound('Invalid entityId'));
  }
  return next();
};

exports.getAll = function (req, res, next) {
  debug('GET all loans service called.');

  var filter = {
    order: '"tsc" DESC',
    include: [
      {
        model: LoanEntityModel.Schema, as: 'LoanEntity', attributes: ['loan_id', 'entity_id', 'role_id'],
        include: [{model: EntityModel.Schema, as: 'Entity'},
          {model: EntityRoleModel.Schema, as: 'EntityRole', attributes: ['id', 'name']}]
      }
    ]
  };

  LoanModel.getAllLoan({filter: filter}, function (error, result) {
    if (_.isEmpty(result)) {
      return next();
    }
    req.session.loanStore = {result:result};
    return next();
  });
};

exports.searchById = function (req, res, next) {
  debug('GET loan by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.id) || params.id === '') {
    return next(new Boom.notFound('Invalid id'));
  }

  LoanModel.findById({id: params.id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.loanStore = result;
    return next();
  });
};

exports.searchEntityById = function (req, res, next) {
  debug('GET Entity by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.entity_id) || params.entity_id==='') {
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

exports.searchAllLoanEntityByEntityId = function (req, res, next) {
  debug('GET AllEntityDocument by id service called.');
  var params = _.merge(req.params, req.body);

  LoanEntityModel.findAllLoanIdByEntityId({id: params.entity_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (_.isEmpty(result)) {
      return next(new Boom.notFound('No loan found related to entity exist'));
    }
    req.session.LoanEntityStore = result;
    return next();
  });
};


exports.searchAllLoanEntityByLoanId = function (req, res, next) {
  debug('GET AllEntityDocument by id service called.');
  var params = _.merge(req.params, req.body);

  LoanEntityModel.findAllEntityIdByLoanId({id: params.loan_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    } else if (_.isEmpty(result)) {
      return next(new Boom.notFound('No loan found related to entity exist'));
    }
    req.session.LoanEntityStore = result;
    return next();
  });
};


exports.getLoanForEntity = function (req, res, next) {
  debug('GET loans for entity_id service called.');

  if (_.isEmpty(req.session.LoanEntityStore)) {
    return next(new Boom.notFound('No loan found related to entity exist'));
  }

  LoanModel.getForEntity({LoanEntityStore: req.session.LoanEntityStore}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.loanStore = result;
    req.session.LoanEntityStore = {};
    return next();
  });
};

exports.getEntityForLoan = function (req, res, next) {
  debug('GET entities for loan_id service called.');

  if (_.isEmpty(req.session.LoanEntityStore)) {
    return next(new Boom.notFound('No loan found related to entity exist'));
  }

  LoanModel.getEntityForLoan({LoanEntityStore: req.session.LoanEntityStore}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.loanStore = result;
    req.session.LoanEntityStore = {};
    return next();
  });
};

exports.updateById = function (req, res, next) {
  debug('PUT loan service called.');

  var params = req.body;

  var data = {
    loan_type_id: params.loan_type_id,
    principal: params.principal,
    loanterm: params.loanterm,
    interestrate: params.interestrate,
    startingdate: params.startingdate,
    data: params.data,
    um: req.user.id || ''
  };
  data = _.pick(params, 'loan_type_id', 'principal', 'loanterm', 'interestrate', 'startingdate', 'data');

  var updatedLoanEntity = {
    role_id: params.role_id
  };

  var filter = {
    where: {
      id: params.id
    },
    include: [
      {model: LoanEntityModel.Schema, as: 'LoanEntity', attributes: ['id', 'loan_id', 'entity_id', 'role_id']}
    ]
  };

  LoanModel.updateById({
    updateData: data,
    updatedLoanEntity: updatedLoanEntity,
    filter: filter
  }, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.loanStore = result;
    return next();
  });
};

exports.deleteById = function (req, res, next) {
  debug('DELETE loan service called.');

  var params = _.merge(req.params, req.body);

  if (_.isEmpty(req.session.loanStore)) {
    return next(new Boom.notFound('Loan not found'), null);
  } else if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid loan'), null);
  } else if (isNaN(params.id) || params.id==='') {
    return next(new Boom.notFound('Invalid id'), null);
  }
  LoanModel.deleteById({id: params.id}, function (error) {
    if (!_.isEmpty(error)) {
      return next();
    }
    req.session.loanStore = {};
    return next();
  });
};

exports.searchEntityRoleById = function (req, res, next) {
  debug('GET loan by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.role_id) || _.isEmpty(params.role_id)) {
    return next(new Boom.notFound('Invalid roleId'));
  }

  EntityRoleModel.findById({id: params.role_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.EntityRoleStore = result;
    return next();
  });
};

exports.searchLoanTypeById = function (req, res, next) {
  debug('GET loan by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.loan_type_id) || params.loan_type_id==='') {
    return next(new Boom.notFound('Invalid loanTypeId'));
  }

  LoanTypeModel.findById({id: params.loan_type_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.LoanTypeStore = result;
    return next();
  });
};

exports.searchEntityById = function (req, res, next) {
  debug('GET loan by id service called.');

  var params = _.merge(req.params, req.body);
  if (isNaN(params.entity_id) || params.entity_id==='') {
    return next(new Boom.notFound('Invalid entityId'));
  }

  EntityModel.findById({id: params.entity_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.EntityStore = result;
    return next();
  });
};


exports.newLoan = function (req, res, next) {
  debug('POST loan service called.');

  var params = req.body;
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid loan'), null);
  }

  var newLoan = {
    loan_type_id: req.session.LoanTypeStore.dataValues.id,
    principal: params.principal,
    loanterm: params.loanterm,
    interestrate: params.interestrate,
    startingdate: params.startingdate || '',
    data: params.data || {},
    tsc: Date.now(),
    tsm: Date.now(),
    um: req.user.id || '',
    uc: req.user.id || ''
  };

  var newLoanEntity = {
    entity_id: req.session.EntityStore.dataValues.id,
    role_id: req.session.EntityRoleStore.dataValues.id,
    tsc: Date.now(),
    tsm: Date.now(),
    uc: req.user.id || '',
    um: req.user.id || ''
  };

  newLoan.LoanEntity = newLoanEntity;

  LoanModel.insert({newLoan: newLoan}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.loanStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid loan'));
  });
};


