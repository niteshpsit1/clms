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

import History from "../utils/History";

var _entities = [];
var selected = null;
var CHANGE_EVENT = 'change';
var ActionTypes = AppConstants.ActionTypes;

function _add(item) {
  _entities.unshift(item);
}

function _update(index, updates) {
  _entities[index] = assign({}, _entities[index], updates);
}

function _updateByID(id, updates) {
  for (var i = _entities.length - 1; i >= 0; i--) {
    if (_entities[i].id === id) {
      _update(i, updates);
      return true;
    }
  };
  return false;
}

function _delete(index) {
  _entities.splice(index, 1);
}

function _deleteByID(id) {
  for (var i = _entities.length - 1; i >= 0; i--) {
    if (_entities[i].id === id) {
      _delete(i);
      return true;
    }
  };
  return false;
}

function _setEntities(entities) {
  _entities = entities;
}

function _getByID(dbid) {
    for (var i = _entities.length - 1; i >= 0; i--) {
      if (_entities[i].id == dbid) {
        return _entities[i];
      }
    };
    return false;
}


var EntityStore = assign({}, EventEmitter.prototype, {
  /**
   * Gets the whole store
   * @return {Object} data
   */
  getAll: function() {
    return _entities;
  },

  /**
   * Gets one item from list
   * @param  {Number} index Array index
   * @return {Object}       List element
   */
  get: function(index) {
    return _entities[index];
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


EntityStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.NEW_ENTITY:
      _add(action.data);
      EntityStore.emitChange();
      History.replaceState(null, "/entities/" + action.data.id);
      break;

    case ActionTypes.ENTITY_EDIT:
      _updateByID(action.data.id, action.data);
      EntityStore.emitChange();
      break;

    case ActionTypes.ENTITY_REMOVE:
      _deleteByID(action.id);
      History.replaceState(null, "/entities");
      EntityStore.emitChange();
      break;

    case ActionTypes.RECEIVE_ENTITIES:
      _setEntities(action.entities);
      EntityStore.emitChange();
      break;

    default:
     //nop
  }
});


export default EntityStore;
