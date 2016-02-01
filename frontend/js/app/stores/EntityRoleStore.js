/**
 * Entity Role store.
 *
 * For now, it's loaded and kept updated using AJAX.
 * This way we can access and share documents content between react components.
 *
 * @author: Ritesh Kumar <ritesh.kumar@daffodilsw.com>
 * @created: 11/01/2016
 * */

import AppDispatcher from "../dispatcher/AppDispatcher";
import AppConstants from "../constants/AppConstants";
import EventEmitter from "events";
import assign from "object-assign";

import History from "../utils/History";

var _entitiesRole = [];
var selected = null;
var CHANGE_EVENT = 'change';
var ActionTypes = AppConstants.ActionTypes;

function _add(item) {
  _entitiesRole.unshift(item);
}

function _update(index, updates) {
  _entitiesRole[index] = assign({}, _entitiesRole[index], updates);
}

function _updateByID(id, updates) {
  for (var i = _entitiesRole.length - 1; i >= 0; i--) {
    if (_entitiesRole[i].id === id) {
      _update(i, updates);
      return true;
    }
  };
  return false;
}

function _delete(index) {
  _entitiesRole.splice(index, 1);
}

function _deleteByID(id) {
  for (var i = _entitiesRole.length - 1; i >= 0; i--) {
    if (_entitiesRole[i].id === id) {
      _delete(i);
      return true;
    }
  };
  return false;
}

function _setEntities(entitieRole) {
  _entitiesRole = entitieRole;
}

function _getByID(dbid) {
    for (var i = _entitiesRole.length - 1; i >= 0; i--) {
      if (_entitiesRole[i].id == dbid) {
        return _entitiesRole[i];
      }
    };
    return false;
}


var EntityRoleStore = assign({}, EventEmitter.prototype, {
  /**
   * Gets the whole store
   * @return {Object} data
   */
  getAll: function() {
    return _entitiesRole;
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


EntityRoleStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.NEW_ENTITYROLE:
      _add(action.data);
      EntityRoleStore.emitChange();
      History.replaceState(null, "/entityrole/" + action.data.id);
      break;

    case ActionTypes.ENTITY_EDITROLE:
      _updateByID(action.data.id, action.data);
      EntityRoleStore.emitChange();
      break;

    case ActionTypes.ENTITYROLE_REMOVE:
      _deleteByID(action.id);
      History.replaceState(null, "/entityrole");
      EntityRoleStore.emitChange();
      break;

    case ActionTypes.RECEIVE_ENTITYSROLE:
      _setEntities(action.entities);
      EntityRoleStore.emitChange();
      break;

    default:
     //
  }
});


export default EntityRoleStore;
