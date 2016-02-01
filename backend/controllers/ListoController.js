'use strict';

var Boom = require('boom');
var _ = require('lodash');

exports.getListo = function (req, res, next) {
  var listoStore = req.session.listoStore;
  if (_.isEmpty(listoStore)) {
    return next(new Boom.notFound('Listo not found'));
  }
  req.session.result = listoStore;
  return next();
};

exports.getNewListo = function (req, res, next) {
  var listoStore = req.session.listoStore;
  if (_.isEmpty(listoStore)) {
    return next(new Boom.notFound('Invalid listo'));
  }
  req.session.result = listoStore;
  return next();
};

