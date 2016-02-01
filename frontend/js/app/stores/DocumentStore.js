/**
 * Document store.
 *
 * For now, it's loaded and kept updated using AJAX.
 * This way we can access and share documents content between react components.
 *
 * @author: Daniele Gazzelloni <daniele@danielegazzelloni.com>
 * @created: 28/10/2015
 * */

import AppDispatcher from "../dispatcher/AppDispatcher";
import AppConstants from "../constants/AppConstants";
import ApiUtils from "../utils/ApiUtils.js";
import EventEmitter from "events";
import assign from "object-assign";

var _documents = [];
var _entityLinks = [], _loanLinks = [], _collateralLinks = [];
var CHANGE_EVENT = 'change';
var ActionTypes = AppConstants.ActionTypes;

function _add(item) {
  _documents.push(item);
}

function update(index, updates) {
  _documents[index] = assign({}, _documents[index], updates);
}

function _delete(index) {
  delete _documents[index];
}

function _deleteByID(id) {
  for (var i = _documents.length - 1; i >= 0; i--) {
    if (_documents[i].id === id) {
      _delete(i);
      return true;
    }
  };
  return false;
}

function _setDocuments(documents) {
  _documents = documents;
}

function _setEntityLinks(links) {
  _entityLinks = links;
}

function _setLoanLinks(links) {
  _loanLinks = links;
}

function _setCollateralLinks(links) {
  _collateralLinks = links;
}


var DocumentStore = assign({}, EventEmitter.prototype, {
  /**
   * Gets the whole store
   * @return {Object} data
   */
  getAll: function() {
    return _documents;
  },

  /**
   * Gets one item from list
   * @param  {Number} index Array index
   * @return {Object}       List element
   */
  get: function(index) {
    return _documents[index];
  },

  getForEntity: function(entityID) {

    var linksForEntity = _entityLinks.filter(function (value) {
      return value.entity_id == entityID;
    });

    var result = _documents.filter(function (value) {
      for (var i = linksForEntity.length - 1; i >= 0; i--) {
         if (linksForEntity[i].document_id == value.id) {
          return true;
         }
       };
       return false;
    });

    return result;
  },

  pushForEntity: function (link) {
    _entityLinks.push(link);
  },

  removeAllForEntity: function(entityID) {

  },

  getForLoan: function(loanID) {

    var linksForLoan = _loanLinks.filter(function (value) {
      return value.loan_id == loanID;
    });

    var result = _documents.filter(function (value) {
      for (var i = linksForLoan.length - 1; i >= 0; i--) {
         if (linksForLoan[i].document_id == value.id) {
          return true;
         }
       };
       return false;
    });

    return result;
  },

  pushForLoan: function (link) {
    _loanLinks.push(link);
  },

  getForCollateral: function(collateralID) {

    var linksForCollateral = _collateralLinks.filter(function (value) {
      return value.collateral_id == collateralID;
    });

    var result = _documents.filter(function (value) {
      for (var i = linksForCollateral.length - 1; i >= 0; i--) {
         if (linksForCollateral[i].document_id == value.id) {
          return true;
         }
       };
       return false;
    });

    return result;
  },

  pushForCollateral: function (link) {
    _collateralLinks.push(link);
  },

  /**
   * Emits a change event
   */
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});


DocumentStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {

    case ActionTypes.NEW_DOCUMENT:
      _add(action.document);
      DocumentStore.emitChange();
      break;

    case ActionTypes.DOCUMENT_REMOVE:
      _deleteByID(action.id);
      DocumentStore.emitChange();
      break;

    case ActionTypes.RECEIVE_DOCUMENTS:
      _setDocuments(action.documents);
      DocumentStore.emitChange();
      break;

    case ActionTypes.RECEIVE_DOC_LOAN_LINKS:
      _setLoanLinks(action.links);
       DocumentStore.emitChange();
      break;

    case ActionTypes.RECEIVE_DOC_ENTITY_LINKS:
      _setEntityLinks(action.links);
       DocumentStore.emitChange();
      break;

    case ActionTypes.RECEIVE_DOC_COLLATERAL_LINKS:
      _setCollateralLinks(action.links);
       DocumentStore.emitChange();
      break;

    default:
     //nop
  }
});


export default DocumentStore;
