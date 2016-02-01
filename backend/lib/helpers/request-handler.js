'use strict';
/**
 * request-handler.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 30/10/2015
 */

var rp = require('request-promise');

var ex = module.exports = function RequestHandler(host) {

  var me = this;
  me.apiUrl = host;

};

var reqHandler = ex.prototype;

reqHandler.GET = function (path, data) {

  var me = this;

  var options = {
    uri: me.apiUrl + path,
    method: 'get',
    headers: {
      //'content-type': 'application/json'
    }
  };

  if (data !== null && data !== undefined) {
    options['qs'] = data;
  }

  return me.REQUEST(options);

};

reqHandler.POST = function (path, data) {

  var me = this;

  var options = {
    uri: me.apiUrl + path,
    method: 'post',
    headers: {
      //'content-type': 'application/x-www-form-urlencoded'
    }

  };
  if (data !== null && data !== undefined) {
    options['form'] = data;
  }

  return me.REQUEST(options);

};


reqHandler.GET_LISTO = function (path, data, token) {

  var me = this;

  var options = {
    uri: me.apiUrl + path,
    method: 'get',
    headers: {
      'Authorization': 'Token ' + token
    },
    json: true
  };

  if (data !== null && data !== undefined) {
    options['qs'] = data;
  }

  return me.REQUEST(options);

};


reqHandler.REQUEST = function (options) {

  var me = this;

  console.log('');
  console.log('Executing Request:');
  console.log(' > ' + options.method + ' ' + options.uri);
  console.log('');

  return rp(options);

};
