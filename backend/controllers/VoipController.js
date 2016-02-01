'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getVoip = function (req, res, next) {
  var voipStore = req.session.voipStore;
  if (_.isEmpty(voipStore)) {
    return next(new Boom.notFound('Voip not found'));
  }
  req.session.result = voipStore;
  return next();
};

exports.getNewVoip = function (req, res, next) {
  var voipStore = req.session.voipStore;
  if (_.isEmpty(voipStore)) {
    return next(new Boom.notFound('Invalid voip'));
  }
  req.session.result = voipStore;
  return next();
};

exports.getUpdatedVoip = function (req, res, next) {
  var voipStore = req.session.voipStore;
  if (_.isEmpty(voipStore)) {
    return next(new Boom.notFound('Failed to update voip'));
  }
  req.session.result = voipStore;
  return next();
};

