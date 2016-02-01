'use strict';
var debug = require('debug')('LMS:ListoRoute');
/**
 * ListoRoute.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 30/11/2015
 */
var Boom = require('boom');
var _ = require('lodash');

var ListoModel = require('./../models/ListoModel');

// ROUTE: /api/listo
// ==============================================
exports.AddListoCred = function (req, res, next) {
  debug('POST listo service called.');
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid listo'));
  } else if (_.isEmpty(params.rfc)) {
    return next(new Boom.notFound('Invalid rfc'));
  } else if (_.isEmpty(params.customer_token)) {
    return next(new Boom.notFound('Invalid customerToken'));
  } else if (isNaN(params.entity_id) || params.entity_id === '') {
    return next(new Boom.notFound('Invalid entityId'));
  }

  var data = {
    rfc: params.rfc,
    customer_token: params.customer_token,
    um: req.user.id || ''
  };
  var filter = {
    id: params.entity_id
  };

  ListoModel.insert({newListo: data, filter: filter}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.listoStore = result;
    return next();
  });
};

exports.GetAllWebHook = function (req, res, next) {
  debug('GET listo webhook service called.');
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('Invalid listo'));
  } else if (_.isEmpty(params.rfc)) {
    return next(new Boom.notFound('Invalid rfc'));
  }

  var filter = {
    where: {data: {listo__rfc: params.rfc}},
    attributes: ['data']
  };

  ListoModel.GetAllListoWebhook({rfc: params.rfc, filter: filter}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notAcceptable(error));
    }
    req.session.listoStore = result;
    return next();
  });
};

