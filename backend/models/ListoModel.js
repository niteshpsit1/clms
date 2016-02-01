'use strict';
var debug = require('debug')('LMS:ListoModel');
/**
 * listo model, defined as following:
 *
 * listo: {
 *  id:            <integer>,
 *  currency:      <string>,
 *  subtotal:      <string>,
 *  discounts:     <string>,
 *  total:         <string>,
 *  issued_on:     <string>,
 *  data:          <json>,
 *  tsm:           <date>,
 *  tsc:           <date>
 * }
 *
 * ListoRoute.js
 * Default description.
 *
 * @author Arsalan Bilal <mabc224gmail.com>
 * @created 30/11/2015
 */
var _ = require('lodash');
var Boom = require('boom');
var db = require('./../lib/db');
var RequestHandler = require('../lib/helpers/request-handler');
var rh = new RequestHandler('https://listo.mx');

var EntityModel = require('./EntityModel');

var ListoModel = db.sequelize.define('listo', {

  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rfc: {
    type: db.Sequelize.STRING
  },
  invoice_id: {
    type: db.Sequelize.STRING
  },
  currency: {
    type: db.Sequelize.STRING
  },
  subtotal: {
    type: db.Sequelize.STRING
  },
  discounts: {
    type: db.Sequelize.STRING
  },
  total: {
    type: db.Sequelize.STRING
  },
  issued_on: {
    type: db.Sequelize.STRING
  },
  data: {
    type: db.Sequelize.JSONB
  }
}, {
  updatedAt: 'tsc',
  createdAt: 'tsm'
});

exports.Schema = ListoModel;

/**
 * Parameter 'rfc', 'token' required, all other are optional
 *
 * This method will receive rfc and invoice
 *
 * @param:        rfc:       <string>,
 *                invoice:   <number>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.GetAllListoWebhook = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid listo'));
  }
  var filter = data.filter;
  if (_.isEmpty(filter)) {
    return callback(new Boom.notFound('Invalid listo'));
  }
  EntityModel.Schema.findOne(filter).then(function (entity) {
      if (_.isEmpty(entity)) {
        return callback(new Boom.notFound('no rfc id exist, can\'t find token'));
      } else {
        var data = entity.data;
        if (!data.hasOwnProperty('listo__rfc')) {
          return callback(new Boom.notFound('no such ' + data.rfc + ' , rfc exist'));
        }
        if (!data.hasOwnProperty('listo__customer_token')) {
          return callback(new Boom.notFound('no listo token exist for ' + data.rfc + ' , can\'t find token'));
        }

        var dataToSend = {offset: 0, size: 1}
        rh.GET_LISTO('/api/invoices/search', dataToSend, entity.data.listo__customer_token).then(function (data) {
          if (data.hits.length === 0) {
            return callback(null, null);
          }

          data = data.hits[0];
          var listoChildObj = {
            is_income: data.is_income,
            approved_rejected_on: data.approved_rejected_on,
            extra_data: data.extra_data,
            approved: data.approved,
            accounting_export_state: data.accounting_export_state,
            total_supplier_paid_mxn: data.total_supplier_paid_mxn,
            total_supplier_paid: data.total_supplier_paid,
            due_on: data.due_on,
            comments_for_supplier: data.comments_for_supplier,
            comments_approval_rejection: data.comments_approval_rejection,
            bank_account: data.bank_account,
            has_pdf: data.has_pdf,
            folio: data.folio,
            category_id: data.category_id,
            payment_state: data.payment_state,
            paid_on: data.paid_on,
            reimbursable_to: data.reimbursable_to,
            issued_on_display: data.issued_on_display,
            num_payments: data.num_payments,
            total_mxn: data.total_mxn,
            is_payroll: data.is_payroll,
            series: data.series,
            single_payment: data.single_payment,
            accounting_export_ready: data.accounting_export_ready,
            customer_rfc_id: data.customer_rfc_id,
            adjusted_subtotal_mxn: data.adjusted_subtotal_mxn,
            accounting_info: data.accounting_info,
            supplier_paid_on: data.supplier_paid_on,
            cancellation_receipt_id: data.cancellation_receipt_id,
            customer_id: data.customer_id,
            counterparty_name: data.counterparty_name
          };

          var listo = {
            rfc: data.rfc,
            invoice_id: data.id,
            subtotal: data.subtotal,
            discounts: data.discounts,
            issued_on: data.issued_on,
            total: data.total,
            currency: data.currency,
            counterparty_rfc: data.counterparty_rfc,
            data: listoChildObj
          };

          ListoModel.create(listo).then(function (result) {
            return callback(null, result.dataValues);
          }).error(function (error) {
            debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
            return callback(error, null);
          });

        }).catch(function (error) {
         return callback(error,null);
        });
      }
    }).error(function (error) {
      debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
    return callback(error,null);
    });
};

/**
 * Parameter 'rfc_id', 'rfc_token' and 'entity_id' required
 *
 * This method will add this detail in entity data record into the database.
 *
 * @param:        rfc:       <string>,
 *                customer_token:     <string>
 *                entity_id:     <integer>
 *
 *
 * @callback:     error: <boolean>
 *                message: <string>,
 *                results: []
 */
exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid listo'));
  }
  var newListo = data.newListo;
  if (_.isEmpty(newListo)) {
    return callback(new Boom.notFound('Invalid listo'));
  }
  EntityModel.Schema.findOne({where: {id: data.filter.id}}).then(function (entityResult) {
    if (_.isEmpty(entityResult)) {
      return callback(new Boom.notFound('no entity id exist, can\'t add listo credentials'));
    } else {
      var listo = {};
      var updateEntity = {};

      listo.listo__rfc = newListo.rfc;
      listo.listo__customer_token = newListo.customer_token;

      updateEntity.data = _.merge({}, entityResult.data, listo);
      updateEntity['um'] = newListo.um;

      entityResult.updateAttributes(updateEntity).then(function () {
        return callback(null, updateEntity);
      }).error(function (error) {
        debug('PostgreSQL: ' + error.message + ' - Are we still connected to database?');
        return callback(error, null);
      });
    }
  }).catch(function (error) {
    return callback(500, true, error.message, []);
  });
};