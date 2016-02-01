'use strict';
/**
 * config.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 12/11/2015
 */

var _ = require('lodash');
var path = require('path');
var utilities = require('./utilities');

process.env.NODE_ENV = ~utilities.walk(path.join(__dirname, '/env'), /(.*)\.js$/).map(function(file) {
    return file.split('/').pop().slice(0, -3);
}).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'local';

// Load app configuration
module.exports = _.extend(
    require('./env/' + process.env.NODE_ENV) || {}
);
