/**
 * development.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 12/11/2015
 */

// General settings
module.exports.server = {
  appName: 'cj-lms-dev',
  port: 3001
};

// Error handling
module.exports.errorHandling = {
  quiteLogging: false         // suppress non-relevant log messages if true
};

// PosgreSQL settings
module.exports.db = {
  pgUser: 'devuser',
  pgPass: 'devuser',
  pgHost: 'credijusto.calikc3p2kxj.us-east-1.rds.amazonaws.com',
  pgPort: 5432,
  pgDatabase: 'credijustodev'
};

// session info
module.exports.session = {
  secret: '$2a$15$JFLtIYX9A4qu9elh3qy6bO1RmEajeVx03FeYZyHKqHJOQZDCJp2Wu',
  expiry: 120 // in minutes,
};

// json web token setting
module.exports.jwt = {
  secret: 'ZAeDIL4YG96cT3W3F/QLb.qjB9DJ0BFKF1FBqFtABbhgBPyjfXpFO'
};

// aws setting
module.exports.aws = {
  secretKey: '6TfyCEl7OUVZWOnD/uvHzNG7IqHt8a7eUi2DU6Qc',
  accessKey: 'AKIAIGVPVNTJNTZGD4NQ',
  region: 'us-west-2',
    s3Bucket: 'dev-recording.credijusto.com',
    s3Docs: 'dev-doc.credijusto.com'
};

module.exports.redis = {
    host : '127.0.0.1',
    port:  6379,
    password:  '',
    db: 2
};

module.exports.kontox = {
    apikey : 'c151e95ae2f0abea62ac1491fc7ed4349db73211ad883d50d565ecdc08fe55df',
    host:  'https://test.api.kontomatik.com'
};
