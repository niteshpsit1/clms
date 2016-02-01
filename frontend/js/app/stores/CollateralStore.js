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
import EventEmitter from "events";
import assign from "object-assign";

var _collaterals = [];
var CHANGE_EVENT = 'change';
var ActionTypes = AppConstants.ActionTypes;

function _add(item) {
  _collaterals.unshift(item);
}

function _update(index, updates) {
  _collaterals[index] = assign({}, _collaterals[index], updates);
}

function _setCollaterals(collaterals) {
  _collaterals = collaterals;
}

function _updateByID(id, updates) {
  for (var i = _collaterals.length - 1; i >= 0; i--) {
    if (_collaterals[i].id === parseInt(id)) {
      _update(i, updates);
      return true;
    }
  };
  return false;
}

function _delete(index) {
  _collaterals.splice(index, 1);
}

function _deleteByID(id) {
  for (var i = _collaterals.length - 1; i >= 0; i--) {
    if (_collaterals[i].id === id) {
      _delete(i);
      return true;
    }
  };
  return false;
}

function _getByID(dbid) {
  for (var i = _collaterals.length - 1; i >= 0; i--) {
    if (_collaterals[i].id == dbid) {
      return _collaterals[i];
    }
  };
  return false;
}


var CollateralStore = assign({}, EventEmitter.prototype, {
  /**
   * Gets the whole store
   * @return {Object} data
   */
  getAll: function() {
    return _collaterals;
  },

  /**
   * Gets one item from list
   * @param  {Number} index Array index
   * @return {Object}       List element
   */
  get: function(index) {
    return _collaterals[index];
  },

  getByID: _getByID,

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


CollateralStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.NEW_COLLATERAL:
      _add(action.data);
      CollateralStore.emitChange();
      break;

    case ActionTypes.COLLATERAL_REMOVE:
      _deleteByID(action.id);
      CollateralStore.emitChange();
      break;

    case ActionTypes.RECEIVE_COLLATERALS:
      _setCollaterals(action.collaterals);
      CollateralStore.emitChange();
      break;

    default:
      //nop
  }
});


export default CollateralStore;
