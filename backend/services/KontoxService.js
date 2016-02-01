//'use strict';
var debug = require('debug')('LMS:KontoxService');
var Boom = require('boom');
var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var tipe = require('tipe');
var xml2js = require('xml2js');
var parser = new xml2js.Parser({explicitArray: false});
var parseString = Promise.promisify(parser.parseString);
var _ = require('lodash');
var KontoxModel = require('../models/KontoxModel');
var RequestHandler = require('./../lib/helpers/request-handler');
var config = require('./../../config/backend.config');
var rh = new RequestHandler(config.kontox.host);
var kontoxApiKey = config.kontox.apikey;

var kontoxJob = require("./../jobs/kontox_job");

//var childProcess = require('child_process');
//var _retrieveChild = childProcess.fork('./backend/models/KontoxModel.js');

exports.importAccounts = function (req, res, next) {
  debug('POST Data service import-accounts called by Kontox');

  function sendResultBack(error, data) {
    if (error) {
      return next(error);
    } else {
      if (tipe(data) !== 'array') {
        data = [data];
      }
      return req.session.result = data;
    }
  }

  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params.sessionId)) {
    return next(new Boom.notFound('Invalid sessionId'));
  } else if (_.isEmpty(params.sessionIdSignature)) {
    return next(new Boom.notFound('Invalid sessionIdSignature'));
  }

  var data = {
    sessionId: params.sessionId,
    sessionIdSignature: params.sessionIdSignature,
    fast: params.fast || false,
    apiKey: kontoxApiKey
  };

  var cmdData = {
    sessionId: params.sessionId,
    sessionIdSignature: params.sessionIdSignature,
    apiKey: kontoxApiKey
  };

  rh.POST('/v1/command/import-accounts.xml', data).then(function (resData) {

    parseString(resData).then(function (result) {

      if (result.hasOwnProperty('reply')) {
        var state = result.reply.command.$.state;
        var commandId = parseInt(result.reply.command.$.id);

        function waitTillResult(status, cmdId) {

          rh.GET('/v1/command/' + cmdId + '.xml', cmdData).then(function (cmdResCB) {

            parseString(cmdResCB).then(function (cmdResParseResultCB) {
              cmdResParseResultCB = cmdResParseResultCB.reply;
              var extCmmand = cmdResParseResultCB.command;
              status = extCmmand.$.state;
              cmdId = parseInt(extCmmand.$.id);
              setTimeout(function () {
                if (status === 'setup') {
                  waitTillResult(status, cmdId);
                } else if (status === 'in_progress') {
                  waitTillResult(status, cmdId);
                } else if (status === 'successful') {
                  sendResultBack(null, extCmmand.result.accounts.account);
                } else if (status === 'cancelled') {
                  sendResultBack(new Boom.badImplementation('Cancelled'));
                } else if (status === 'error') {
                  sendResultBack(new Boom.badImplementation(extCmmand.exception.message));
                }
              }, 3000);

            }).catch(function (err) {
              return sendResultBack(new Boom.badImplementation('Error Parsing XML'));
            });

          }).catch(function (e) {
            parseString(e.error).then(function (error) {
              return sendResultBack(new Boom.create(e.statusCode, [error.reply.exception.message]), []);
            }).catch(function (err) {
              return sendResultBack(new Boom.badRequest('Error Parsing XML'), []);
            });
          });
        }

        return waitTillResult(state, commandId);
      } else {
        return sendResultBack(new Boom.notFound('No reply Tag found'));
      }

    }).catch(function (e) {
      return sendResultBack(new Boom.badRequest('Error Parsing XML'));
    });

  }).catch(function (e) {
    parseString(e.error).then(function (error) {
      return sendResultBack(new Boom.create(e.statusCode, [error.reply.exception.message]), []);
    }).catch(function (err) {
      return sendResultBack(new Boom.badRequest('Error Parsing XML'), []);
    });
  });
}

exports.importAccountTransaction = function (req, res, next) {
  debug('POST Data service import-account-transactions called by Kontox');

  function sendResultBack(error, data) {
    if (error) {
      return next(error);
    } else {
      if (tipe(data) !== "array") {
        data = [data];
      }
      return req.session.result = data;
    }
  }

  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params.sessionId)) {
    return next(new Boom.notFound('Invalid sessionId'));
  } else if (_.isEmpty(params.sessionIdSignature)) {
    return next(new Boom.notFound('Invalid sessionIdSignature'));
  } else if (_.isEmpty(params.iban)) {
    return next(new Boom.notFound('Invalid iban'));
  } else if (_.isEmpty(params.since)) {
    return next(new Boom.notFound('Invalid since'));
  } else if (_.isEmpty(params.fast)) {
    return next(new Boom.notFound('Invalid fast'));
  }

  var data = {
    apiKey: kontoxApiKey,
    sessionId: params.sessionId,
    sessionIdSignature: params.sessionIdSignature,
    fast: params.fast,
    since: params.since,
    iban: params.iban
  };

  var cmdData = {
    sessionId: params.sessionId,
    sessionIdSignature: params.sessionIdSignature,
    apiKey: kontoxApiKey
  };

  rh.POST('/v1/command/import-account-transactions.xml', data).then(function (resData) {

    parseString(resData).then(function (result) {

      if (result.hasOwnProperty('reply')) {
        var state = result.reply.command.$.state;
        var commandId = parseInt(result.reply.command.$.id);

        function waitTillResult(status, cmdId) {

          rh.GET('/v1/command/' + cmdId + '.xml', cmdData).then(function (cmdResCB) {

            parseString(cmdResCB).then(function (cmdResParseResultCB) {
              cmdResParseResultCB = cmdResParseResultCB.reply;
              var extCmmand = cmdResParseResultCB.command;
              status = extCmmand.$.state;
              cmdId = parseInt(extCmmand.$.id);
              setTimeout(function () {
                if (status === 'setup') {
                  waitTillResult(status, cmdId);
                } else if (status === 'in_progress') {
                  waitTillResult(status, cmdId);
                } else if (status === 'successful') {
                  sendResultBack(null, extCmmand.result.moneyTransactions.moneyTransaction);
                } else if (status === 'cancelled') {
                  sendResultBack(new Boom.badImplementation('Cancelled'));
                } else if (status === 'error') {
                  sendResultBack(new Boom.badImplementation(extCmmand.exception.message));
                }
              }, 3000);
            }).catch(function (err) {
              return sendResultBack(new Boom.badImplementation('Error Parsing XML'));
            })
          }).catch(function (e) {
            parseString(e.error).then(function (error) {
              return sendResultBack(new Boom.create(e.statusCode, [error.reply.exception.message]), []);
            }).catch(function (err) {
              return sendResultBack(new Boom.badRequest('Error Parsing XML'), []);
            });
          });
        }

        return waitTillResult(state, commandId);
      } else {
        return sendResultBack(new Boom.notFound('No reply Tag found'));
      }
    }).catch(function (e) {
      return sendResultBack(new Boom.badRequest('Error Parsing XML'));
    });

  }).catch(function (e) {
    parseString(e.error).then(function (error) {
      return sendResultBack(new Boom.create(e.statusCode, [error.reply.exception.message]), []);
    }).catch(function (err) {
      return sendResultBack(new Boom.badRequest('Error Parsing XML'), []);
    });
  });
};

exports.importOwners = function (req, res, next) {
  debug('POST Data service import-owners called by Kontox');

  function sendResultBack(error, data) {
    if (error) {
      return next(error);
    } else {
      if (tipe(data) !== "array") {
        data = [data];
      }
      return req.session.result = data;
    }
  }

  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params.sessionId)) {
    return next(new Boom.notFound('Invalid sessionId'));
  } else if (_.isEmpty(params.sessionIdSignature)) {
    return next(new Boom.notFound('Invalid sessionIdSignature'));
  }

  var data = {
    apiKey: kontoxApiKey,
    sessionId: params.sessionId,
    sessionIdSignature: params.sessionIdSignature
  };

  var cmdData = {
    sessionId: params.sessionId,
    sessionIdSignature: params.sessionIdSignature,
    apiKey: kontoxApiKey
  };

  rh.POST('/v1/command/import-owners.xml', data).then(function (resData) {
    parseString(resData).then(function (result) {

      if (result.hasOwnProperty('reply')) {
        var state = result.reply.command.$.state;
        var commandId = parseInt(result.reply.command.$.id);

        function waitTillResult(status, cmdId) {
          rh.GET('/v1/command/' + cmdId + '.xml', cmdData).then(function (cmdResCB) {

            parseString(cmdResCB).then(function (cmdResParseResultCB) {
              cmdResParseResultCB = cmdResParseResultCB.reply;
              var extCmmand = cmdResParseResultCB.command;
              status = extCmmand.$.state;
              cmdId = parseInt(extCmmand.$.id);
              setTimeout(function () {
                if (status === 'setup') {
                  waitTillResult(status, cmdId);
                } else if (status === 'in_progress') {
                  waitTillResult(status, cmdId);
                } else if (status === 'successful') {
                  sendResultBack(null, extCmmand.result.owners.owner);
                } else if (status === 'cancelled') {
                  sendResultBack(new Boom.badImplementation('Cancelled'));
                } else if (status === 'error') {
                  sendResultBack(new Boom.badImplementation(extCmmand.exception.message));
                }
              }, 3000);
            }).catch(function (err) {
              return sendResultBack(new Boom.badImplementation('Error Parsing XML'));
            });

          }).catch(function (e) {
            parseString(e.error).then(function (error) {
              return sendResultBack(new Boom.create(e.statusCode, [error.reply.exception.message]), []);
            }).catch(function (err) {
              return sendResultBack(new Boom.badRequest('Error Parsing XML'), []);
            });
          });
        }

        return waitTillResult(state, commandId);
      } else {
        return sendResultBack(new Boom.notFound('No reply Tag found'));
      }
    }).catch(function (e) {
      return sendResultBack(new Boom.badRequest('Error Parsing XML'));
    });

  }).catch(function (e) {
    parseString(e.error).then(function (error) {
      return sendResultBack(new Boom.create(e.statusCode, [error.reply.exception.message]), []);
    }).catch(function (err) {
      return sendResultBack(new Boom.badRequest('Error Parsing XML'), []);
    });
  });
};

exports.signOut = function (req, res, next) {
  debug('POST Data service sign-out called by Kontox');

  function sendResultBack(error, data) {
    if (error) {
      return next(error);
    } else {
      if (tipe(data) !== "array") {
        data = [data];
      }
      return req.session.result = data;
    }
  }

  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params.sessionId)) {
    return next(new Boom.notFound('Invalid sessionId'));
  } else if (_.isEmpty(params.sessionIdSignature)) {
    return next(new Boom.notFound('Invalid sessionIdSignature'));
  }

  var data = {
    sessionId: params.sessionId,
    sessionIdSignature: params.sessionIdSignature
  };

  rh.POST('/v1/command/sign-out.xml', data).then(function (resData) {
    parseString(resData).then(function (result) {
      if (result.hasOwnProperty('reply')) {

        var status = result.reply.$.status;
        if (status === '200 OK') {
          return sendResultBack(null, []);
        } else {
          return sendResultBack(new Boom.badRequest('Error in sign Out'), []);
        }

      } else {
        return sendResultBack(new Boom.notFound('No reply Tag found'));
      }

    }).catch(function (e) {
      parseString(e.error).then(function (error) {
        return sendResultBack(new Boom.create(e.statusCode, [error.reply.exception.message]), []);
      }).catch(function (err) {
        return sendResultBack(new Boom.badRequest('Error Parsing XML'), []);
      });
    });

  }).catch(function (e) {
    parseString(e.error).then(function (error) {
      return sendResultBack(new Boom.create(e.statusCode, [error.reply.exception.message]), []);
    }).catch(function (err) {
      return sendResultBack(new Boom.badRequest('Error Parsing XML'), []);
    });
  });
};

exports.aggregates = function (req, res, next) {
  debug('POST Data service aggregates called by Kontox');

  function sendResultBack(error, data) {
    if (error) {
      return next(error);
    } else {
      if (tipe(data) !== "array") {
        data = [data];
      }
      return req.session.result = data;
    }
  }

  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params.ownerExternalId)) {
    return next(new Boom.notFound('Invalid ownerExternalId'));
  }

  var data = {
    ownerExternalId: params.ownerExternalId
  };

  rh.GET('/v1/aggregates.xml', data).then(function (resData) {
    parseString(resData).then(function (result) {
      if (result.hasOwnProperty('reply')) {

        var dataToSend = {};
        dataToSend.externalId = result.reply.owner.$.externalId;
        dataToSend.target = result.reply.owner.target.$.name;
        dataToSend.activeSinceAtLeast = result.reply.owner.target.accounts.account[0].activeSinceAtLeast;
        dataToSend.currencyName = result.reply.owner.target.accounts.account[0].currencyName;
        dataToSend.iban = result.reply.owner.target.accounts.account[0].iban;
        dataToSend.owner = result.reply.owner.target.accounts.account[0].owner;
        dataToSend.accounts = result.reply.owner.target.accounts.account[0].months;
        var status = result.reply.$.status;

        if (status === '200 OK') {
          return sendResultBack(null, dataToSend);
        } else {
          return sendResultBack(new Boom.badRequest('Error in sign Out'), dataToSend);
        }
      } else {
        return sendResultBack(new Boom.notFound('No reply Tag found'));
      }
    }).catch(function (e) {
      parseString(e.error).then(function (error) {
        return sendResultBack(new Boom.create(e.statusCode, [error.reply.exception.message]), []);
      }).catch(function (err) {
        return sendResultBack(new Boom.badRequest('Error Parsing XML'), []);
      });
    });

  }).catch(function (e) {
    parseString(e.error).then(function (error) {
      return sendResultBack(new Boom.create(e.statusCode, [error.reply.exception.message]), []);
    }).catch(function (err) {
      return sendResultBack(new Boom.badRequest('Error Parsing XML'), []);
    });
  });
};


exports.add = function (req, res, next) {
  debug('POST Data service called by Kontox');

  var params = _.merge(req.params, req.body);
  if (_.isEmpty(params.sessionId)) {
    return next(new Boom.notFound('Invalid sessionId'));
  } else if (_.isEmpty(params.sessionIdSignature)) {
    return next(new Boom.notFound('Invalid sessionIdSignature'));
  } else if (isNaN(params.entity_id) || _.isEmpty(params.entity_id)) {
    return next(new Boom.notFound('Invalid entityId'));
  }

  var data = {
    sessionId: params.sessionId,
    sessionIdSignature: params.sessionIdSignature,
    fast: params.fast || false,
    entity_id: params.entity_id
  };

  //_retrieveChild.send(data);
  kontoxJob.create('kontox', data).attempts(5).save();
  kontoxJob
  .on('job enqueue', function(id, type){
    debug( 'Job %s got queued of type %s', id, type );
    req.session.result = {message: true, text: 'Added Successful', job: id};
    return next();
  })
  //.on('job complete', function(id, result){
  //
  //});

};


exports.getAccountInfoForEntity = function (req, res, next) {
  debug('GET kontox by entityId service called.');
  var params = _.merge(req.params, req.body);
  if (isNaN(params.entity_id) || _.isEmpty(params.entity_id)) {
    return next(new Boom.notFound('Invalid entityId'));
  }
  KontoxModel.findByEntityId({entity_id: params.entity_id}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(new Boom.notFound(error));
    }
    req.session.kontoxStore = result;
    return next();
  });
};
