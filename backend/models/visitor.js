'use strict';
/**
 *
 *
 * message model, defined as following:
 *
 * loan_type: {
 *  id:             <integer>,
 *  content:        <string>,
 *  from:           <string>,
 *  to:             <string>,
 *  tsc:            <date>
 *  tsm:            <date>
 * }
 *
 * message.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 27/11/2015
 */


/**
 * Message model
 */

var util = require('util');
var db = require('./../lib/db');
var Visitor = require('./models').Visitor;

/*
 var Visitor = db.sequelize.define('visitor' , {

 id : {
 type : db.Sequelize.INTEGER,
 primaryKey : true,
 autoIncrement : true
 },

 country : {
 type : db.Sequelize.STRING,
 allowNull : false
 },

 city : {
 type : db.Sequelize.STRING,
 allowNull : false
 },

 ip :{
 type : db.Sequelize.STRING,
 allowNull : false
 },

 browsername :{
 type : db.Sequelize.STRING,
 allowNull : false
 },

 fullversion : {
 type : db.Sequelize.STRING,
 allowNull : false
 },

 osname : {
 type : db.Sequelize.STRING,
 allowNull : false
 },

 category : {
 type : db.Sequelize.INTEGER,
 allowNull : false
 }

 } ,
 {
 updatedAt : 'tsc',
 createdAt : 'tsm'
 });


 module.exports.Visitor = Visitor;
 */


/******************************************************************
 *
 * add User for socket use
 *
 *   @param
 *
 *    userinfo : JSON
 *
 *    callback : function ( result, errcode , visitor)
 *
 ******************************************************************/
module.exports.add = function (userinfo, callback) {

  if (userinfo.country == null) {
    callback(false, 0);
  } else {
    userinfo.country = userinfo.country.trim();
    if (userinfo.country == '') {
      callback(false, 0, null);
    }
  }

  if (userinfo.city == null) {
    callback(false, 1);
  } else {
    userinfo.city = userinfo.city.trim();
    if (userinfo.city == '') {
      callback(false, 1, null);
    }
  }

  if (userinfo.ip == null) {
    callback(false, 2);
  } else {
    userinfo.ip = userinfo.ip.trim();
    if (userinfo.ip == '') {
      callback(false, 2, null);
    }
  }

  if (userinfo.browsername == null) {
    callback(false, 3);
  } else {
    userinfo.browsername = userinfo.browsername.trim();
    if (userinfo.browsername == '') {
      callback(false, 3, null);
    }
  }

  if (userinfo.fullversion == null) {
    callback(false, 4);
  } else {
    userinfo.fullversion = userinfo.fullversion.trim();
    if (userinfo.fullversion == '') {
      callback(false, 4, null);
    }
  }

  if (userinfo.osname == null) {
    callback(false, 5);
  } else {
    userinfo.osname = userinfo.osname.trim();
    if (userinfo.osname == '') {
      callback(false, 5, null);
    }
  }

  if (userinfo.category == null) {
    callback(false, 6);
  } else {
    userinfo.category = parseInt(userinfo.category);
    if (userinfo.category != 0 && userinfo.category != 1) {
      callback(false, 7);
    }
  }

  Visitor.create(userinfo)
    .then(function (visitor) {
      callback(true, null, visitor);
    }).
    error(function (err) {
      console.log(err);
      callback(false, 7, null);
    });
};

/***************************************************************

 check if user already exist  for socket use

 @param : id
 callback(result ,  visitor)

 if result is false, don't exists
 if result is true, exists

 ***************************************************************/
module.exports.exists = function (id, callback) {

  if (id == null) {
    callback(false);
  } else {
    var uid = parseInt(id);
    if (uid == -1) {
      callback(false);
    } else {

      Visitor.findById(uid).then(function (result) {
        if (result == null) {
          callback(false, null);
        } else {
          callback(true, result);
        }
      })
        .error(function (err) {
          callback(false, null);
        });

    }
  }

};

/****************************************************************

 update user's category for socket use

 @param : id
 callback(result)

 *****************************************************************/
module.exports.updateCategory = function (id, callback) {

  if (id == null) {
    callback(false);
  } else {
    var uid = parseInt(id);
    if (uid == -1) {
      callback(false);
    } else {

      Visitor.findOne({where: {id: uid}}).then(function (user) {

        if (user != null) {
          var data = [];
          data['category'] = 1;
          user.updateAttributes(data).then(function () {
            callback(true);
          });
        } else {
          callback(false);
        }
      });

    }
  }

};