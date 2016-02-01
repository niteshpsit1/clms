/**
 * Loan Type store.
 *
 * For now, it's loaded and kept updated using AJAX.
 * This way we can access and share documents content between react components.
 *
 * @author: Ritesh Kumar <ritesh.kumar@daffodilsw.com>
 * @created: 12/01/2016
 * */

import AppDispatcher from "../dispatcher/AppDispatcher";
import AppConstants from "../constants/AppConstants";
import EventEmitter from "events";
import assign from "object-assign";

import History from "../utils/History";

var _search = [];
var selected = null;
var CHANGE_EVENT = 'change';
var ActionTypes = AppConstants.ActionTypes;

function _add(item) {
  _search.unshift(item);
}

function _update(index, updates) {
  _search[index] = assign({}, _search[index], updates);
}

function _updateByID(id, updates) {
  for (var i = _search.length - 1; i >= 0; i--) {
    if (_search[i].id === id) {
      _update(i, updates);
      return true;
    }
  };
  return false;
}

function _delete(index) {
  _search.splice(index, 1);
}

function _deleteByID(id) {
  for (var i = _search.length - 1; i >= 0; i--) {
    if (_search[i].id === id) {
      _delete(i);
      return true;
    }
  };
  return false;
}

function _setEntities(result) {
  _search = result;
}

function _getByID(dbid) {
    for (var i = _search.length - 1; i >= 0; i--) {
      if (_search[i].id == dbid) {
        return _search[i];
      }
    };
    return false;
}


var SearchStore = assign({}, EventEmitter.prototype, {
  /**
   * Gets the whole store
   * @return {Object} data
   */
  getAll: function() {
    return _search;
  },

  /**
   * Gets one item from list
   * @param  {Number} index Array index
   * @return {Object}       List element
   */
  get: function(index) {
    return _search[index];
  },

  getByID: _getByID,

  deleteByID: _deleteByID,

  /**
   * Selects an item
   */
  select: function(index) {
    if (index !== undefined && index <= this.list.length && index >= 0) {
      this.selected = index;
    } else {
      this.selected = null;
    }
  },

  getSelected: function() {
    return (this.selected !== null && this.selected !== undefined ? this._entities[this.selected] : null);
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
  },

  push: function(item) {
    _add(item);
  }
});


SearchStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_SEARCH:
      _setEntities(action.entities);
      SearchStore.emitChange();
      break;

    default:
     //
  }
});


export default SearchStore;
