'use strict';
/**
 * aws.js
 * Shared wrapper library for AWS-SDK initialization.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 13/11/2015
 */

// Load AWS Settings
var config = require('./../../../config/backend.config');
var accessKeyId = config.aws.accessKey;
var secretAccessKey = config.aws.secretKey;
var region = config.aws.region;

// Deps
var AWS = require('aws-sdk');
var Promise = require('bluebird');

// Configure the AWS SDK
var awsOptions = {
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region
  // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
};
AWS.config.update(awsOptions);

// Export
module.exports = {
  AWS: AWS,
  S3Async: Promise.promisifyAll(new AWS.S3({region: region})),
  s3: new AWS.S3({region: region})
};

