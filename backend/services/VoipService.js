'use strict';
var debug = require('debug')('LMS:EntityDocumentService');

var shortid = require('shortid');
var Boom = require('boom');
var _ = require('lodash');

var VoipModel = require('../models/VoipModel');

exports.validateUpdateVoipParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid voip'));
  } else if (_.isEmpty(params.uniqueid)) {
    return next(new Boom.notFound('Invalid uniqueid'));
  }
  return next();
};

exports.validateVoipParams = function (req, res, next) {
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid voip1'));
  } else if (isNaN(params.billsec)) {
    return next(new Boom.notFound('Invalid billsec'));
  }
  return next();
};

exports.newVoip = function (req, res, next) {
  debug('POST voip service called.');

  var params = req.body;
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid voip'), null);
  }

  var newVoip = {
    uniqueid: params.uniqueid || shortid.generate(),
    billsec: params.billsec,
    src: params.src,
    dst: params.dst,
    calldate: params.calldate,
    disposition: detectKindOfCall(params.src, params.dst),
    status: params.status || '',
    text: params.text || ''
  };
  var file = req.file;
  VoipModel.insert({newVoip: newVoip, file: file}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    } else if (!_.isEmpty(result)) {
      req.session.voipStore = result;
      return next();
    }
    return next(new Boom.notFound('Invalid voip'));
  });
};

exports.updateById = function (req, res, next) {
  debug('PUT voip service called.');
  var params = req.body;

  var data = {
    src: params.src,
    dst: params.dst,
    status: params.status,
    text: params.text
  };
  data = _.pick(params, 'src', 'dst', 'status', 'text');
  var filter = {
    uniqueid: params.uniqueid
  };
  VoipModel.updateById({updateData: data, filter: filter}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.voipStore = result;
    return next();
  });
};

function detectKindOfCall(src, dst) {
  var type;
  if (src.length === 4 || src.length === 3) {
    src = 'IntExtensions';
  } else {
    src = 'ExtPhones';
  }

  if (dst.length === 4 || dst.length === 3) {
    dst = 'IntExtensions';
  } else {
    dst = 'ExtPhones';
  }

  if (src === 'IntExtensions' && dst === 'ExtPhones') {
    type = 'OUTBOUND';
  } else if (src === 'ExtPhones' && dst === 'IntExtensions') {
    type = 'INBOUND';
  } else if (src === 'IntExtensions' && dst === 'IntExtensions') {
    type = 'INTERNAL';
  }
  return type;
}