'use strict';
/**
 * local.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 12/11/2015
 */
var PROCESS_ENV = process.env;
// General settings
module.exports.server = {
  appName: 'cj-lms-local',
  port: 3003
};
// Error handling
module.exports.errorHandling = {
  quiteLogging: false         // suppress non-relevant log messages if true
};

// PosgreSQL settings
module.exports.db = {
  pgUser: PROCESS_ENV.LMS_PG_USER,
  pgPass: PROCESS_ENV.LMS_PG_PASSWORD,
  pgHost: PROCESS_ENV.LMS_PG_HOST,
  pgPort: PROCESS_ENV.LMS_PG_PORT,
  pgDatabase: PROCESS_ENV.LMS_PG_DATABASE
};

// session info
module.exports.session = {
  secret: '$2a$15$JFLtIYX9A4qu9elh3qy6bO1RmEajeVx03FeYZyHKqHJOQZDCJp2Wu',
  expiry: 120 // in minutes
};

// json web token setting
module.exports.jwt = {
  secret: 'ZAeDIL4YG96cT3W3F/QLb.qjB9DJ0BFKF1FBqFtABbhgBPyjfXpFO'
};

// aws setting
module.exports.aws = {
  secretKey: PROCESS_ENV.LMS_AWS_SECRET_ACCESS_KEY,
  accessKey: PROCESS_ENV.LMS_AWS_ACCESS_KEY,
  region: PROCESS_ENV.LMS_AWS_REGION,
  s3Bucket: PROCESS_ENV.LMS_AWS_S3_BUCKET,
    s3Docs: 'dev-doc.credijusto.com'
};

module.exports.redis = {
    host : '127.0.0.1',
    port:  6379,
    password:  '',
    db: 3
};

module.exports.kontox = {
    apikey : 'c151e95ae2f0abea62ac1491fc7ed4349db73211ad883d50d565ecdc08fe55df',
    host:  'https://test.api.kontomatik.com'
};
