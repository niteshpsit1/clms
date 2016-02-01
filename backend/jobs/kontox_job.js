var Promise = require("bluebird");
var tipe = require('tipe');
var php = require('phpjs');
var _ = require('lodash');
var xml2js = require('xml2js');
var kue = require('kue');
var parser = new xml2js.Parser({explicitArray : false});
var parseString  = Promise.promisify(parser.parseString);
var config        = require("./../../config/backend.config");
var debug = require('debug')('LMS:kontox_job');
var RequestHandler = require('../lib/helpers/request-handler');
var rh = new RequestHandler(config.kontox.host);
var kontoxApiKey = config.kontox.apikey;
var KontoxModel =             require('./../models/KontoxModel');


var jobs = kue.createQueue({
    prefix: 'q',
    redis: {
        port: config.redis.port,
        host: config.redis.host,
        auth: config.redis.password,
        db: config.redis.db,
        options: {
            // see https://github.com/mranney/node_redis#rediscreateclient
        }
    }
});

//Finding active jobs from Redis - start
// kue.Job.rangeByType ('job', 'active', 0, 10, 'asc', function (err, selectedJobs) {
//     selectedJobs.forEach(function (job) {
//         job.state('inactive').save();
//     });
// });
//Finding active jobs from Redis - end

//Start all previous jobs in the redis - start
jobs.active( function( err, ids ) {
    ids.forEach( function( id ) {
        kue.Job.get( id, function( err, job ) {
            job.inactive();
        });
    });
});
//Start all previous jobs in the redis - end

//start jobs processing queue
jobs.process('kontox', function(job, done){
    longRunningTask(job.data, job, done);
});


function longRunningTask(data, job, done){

    debug("Processing for: "+ JSON.stringify(data))
    default_accounts(data).then(function(ia){
        debug("Job Done Successfully");

        var kontox = {};
        if(tipe(ia.owners.owner) !== "array"){
            ia.owners.owner = [ia.owners.owner];
        }
        if(tipe(ia.accounts.account) !== "array"){
            ia.accounts.account = [ia.accounts.account];
        }
        kontox.entity_id = data.entity_id;
        kontox.accountOwners =  ia.owners.owner;
        kontox.accountTransactions = ia.accounts.account;

        KontoxModel.insert(kontox, function(err, result) {
            if(err){
                done(err);
            } else {
                done(null, result);
            }
        })

    }).catch(function(error){
        done(error);
    })

}

function default_accounts(data){
    return new Promise(function (resolve, reject) {

        var sessionId = data.sessionId;
        var sessionIdSignature = data.sessionIdSignature;
        var fast = true;

        var oldDate = php.date("Y-m-d");
        var newDate = php.strtotime("-180 DAYS", php.strtotime(oldDate));
        newDate = php.date("Y-m-d", newDate);
        var dataToPass = {
            sessionId: sessionId,
            sessionIdSignature: sessionIdSignature,
            apiKey: kontoxApiKey,
            since: newDate
        };
        var cmdData = {
            sessionId: sessionId,
            sessionIdSignature: sessionIdSignature,
            apiKey: kontoxApiKey
        };

        debug('default-import starting');
        return rh.POST('/v1/command/default-import.xml', dataToPass).then(function(resData){

            return parseString(resData).then(function (result) {

                if(result.hasOwnProperty('reply')) {
                    var state = result.reply.command.$.state;
                    var commandId = parseInt(result.reply.command.$.id);

                    function waitTillResult(status, cmdId) {

                        return rh.GET('/v1/command/' + cmdId + '.xml', cmdData).then(function (cmdResCB) {
                            return parseString(cmdResCB).then(function (cmdResParseResultCB) {
                                cmdResParseResultCB = cmdResParseResultCB.reply;
                                var extCmmand = cmdResParseResultCB.command;
                                status = extCmmand.$.state;
                                cmdId = parseInt(extCmmand.$.id);
                                setTimeout(function () {

                                    if (status === "setup") {
                                        waitTillResult(status, cmdId);
                                    } else if (status === "in_progress") {
                                        waitTillResult(status, cmdId);
                                    } else if (status === "successful") {
                                        return resolve(extCmmand.result)
                                    } else if (status === "cancelled") {
                                        return reject(setError( extCmmand.exception.message, 500, "Cancelled: Error occurred on kontox server in running status command"));
                                    } else if (status === "error") {
                                        return reject(setError( extCmmand.exception.message, 500, "Error occurred on kontox server in running status command"));
                                    }

                                }, 3000);


                            }).catch(function (e) {
                                return reject(setError( "import_accounts: Error Parsing XML", 400, e));
                            })

                        }).catch(function(e) {
                            return parseString(e.error).then(function (error) {
                                return reject(setError( "import_accounts: "+error.reply.exception.message, e.statusCode, e));
                            }).catch(function (error) {
                                return reject(setError( "import_accounts: Error Parsing XML", 400, e));
                            })


                        });

                    }

                    return waitTillResult(state, commandId);
                } else {
                    return reject(setError( "import_accounts: No reply Tag found", 400, []));
                }

            }).catch(function(e) {
                return reject(setError( "import_accounts: Error Parsing XML", 400, e));
            });


        }).catch(function(e){
            return parseString(e.error).then(function (error) {
                return reject(setError( "import_accounts: "+error.reply.exception.message, e.statusCode, e));
            }).catch(function (error) {
                return reject(setError( "import_accounts: Error Parsing XML", 400, e));
            })
        })

    })
}

module.exports = jobs;


function setError( message, statusCode, fullError){
    var err = new Error(message);
    err.statusCode = statusCode;
    err.error = true;
    err.fullError = fullError;
    return err;
}