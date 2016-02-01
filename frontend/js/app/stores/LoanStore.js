import AppDispatcher from "../dispatcher/AppDispatcher";
import AppConstants from "../constants/AppConstants";
import EventEmitter from "events";
import assign from "object-assign";
import History from "../utils/History"

var _loans = [];
var selected = null;
var CHANGE_EVENT = 'change';
var ActionTypes = AppConstants.ActionTypes;

function _add(item) {
  _loans.unshift(item);
}

function _update(index, updates) {
  _loans[index] = assign({}, _loans[index], updates);
}

function _setLoans(loans) {
  _loans = loans;
}

function _updateByID(id, updates) {
  for (var i = _loans.length - 1; i >= 0; i--) {
    if (_loans[i].id === parseInt(id)) {
      _update(i, updates);
      return true;
    }
  };
  return false;
}

function _delete(index) {
  _loans.splice(index, 1);
}

function _deleteByID(id) {
  for (var i = _loans.length - 1; i >= 0; i--) {
    if (_loans[i].id === id) {
      _delete(i);
      return true;
    }
  };
  return false;
}

function _getByID(dbid) {
  for (var i = _loans.length - 1; i >= 0; i--) {
    if (_loans[i].id == dbid) {
      return _loans[i];
    }
  };
  return false;
}


var LoanStore = assign({}, EventEmitter.prototype, {
  /**
   * Gets the whole store
   * @return {Object} data
   */
  getAll: function() {
    return _loans;
  },

  /**
   * Gets one item from list
   * @param  {Number} index Array index
   * @return {Object}       List element
   */
  get: function(index) {
    return _loans[index];
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


LoanStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.NEW_LOAN:
      _add(action.data);
      LoanStore.emitChange();
      History.replaceState(null, "/loans/" + action.data.id);
      break;

    case ActionTypes.LOAN_EDIT:
      _updateByID(action.data.id, action.data);
      LoanStore.emitChange();
      break;

    case ActionTypes.LOAN_REMOVE:
      _deleteByID(action.id);
      LoanStore.emitChange();
      History.replaceState(null, "/loans");
      break;

    case ActionTypes.RECEIVE_LOANS:

      _setLoans(action.loans);
      LoanStore.emitChange();
      break;

    default:
      //nop
  }
});


export default LoanStore;
