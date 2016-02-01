/**
 *
 * ledger model, defined as following:
 *
 * ledger: {
 *  id:         <integer>,
 *  name:       <string>,
 *  loan_id:    <integer>,
 *  account_id: <integer>,
 *  amount:     <money>,
 *  projection: <string>,
 *  datedue:    <date>,
 *  installment:<integer>,
 *  principal:  <money>,
 *  interest:   <float>,
 *  balance:    <money>,
 *  um:         <string>
 *  uc:         <string>
 *  tsc:        <date>
 *  tsm:        <date>
 * }
 *
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 20/11/2015
 */

var util = require('util');

var db = require("./../db");
var config = require("./../../config/backend.config");
var logger = require("./../logger");
var Entity = require("./models").Entity;
var Loan = require("./models").Loan;

exports.getList = function (req, callback) {
      // Filter
    if(req.query && req.query.name)
    {
        var filterName = {
            where: {
                $or : { name: { $ilike: '%'+req.query.name+'%' } , dba: { $ilike: '%'+req.query.name+'%' }  } 
            }
        };

        Entity.findAll(filterName)
        .then(function (result) {
            if(result.length) {
                callback(200, false, "OK", result);
            }
            else{
                callback(404, true, "no result found for rearch inside", []);
            }
    
        })
        .error( function(error) {
            logger.log("*", "PostgreSQL: "+error.message+" - Are we still connected to database?");
            callback(500, true, error.message, []);
        });

    }  else {
        callback(404, true, "no result found for rearch", []);
    }
};