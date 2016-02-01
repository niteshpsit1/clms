'use strict';
var debug = require('debug')('LMS:DownloadService');

var Boom = require('boom');
var _ = require('lodash');

var DocumentModel = require('../models/DocumentModel');


exports.downloadDocument = function (req, res, next) {
  debug('GET download document service called.');
  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params.name)) {
    return next(new Boom.notFound('Invalid name'));
  }
  DocumentModel.downloadDocument(req, res, next);
};