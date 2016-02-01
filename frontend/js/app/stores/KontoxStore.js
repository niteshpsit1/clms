/**
 * Document store.
 *
 * For now, it's loaded and kept updated using AJAX.
 * This way we can access and share documents content between react components.
 *
 * @author: Jitendra Shakya <jitendra.shakyawar@linkites.com>
 * @created: 28/01/2016
 * */

import AppDispatcher from "../dispatcher/AppDispatcher";
import AppConstants from "../constants/AppConstants";
import EventEmitter from "events";
import assign from "object-assign";

import History from "../utils/History";

var _entitykontoxaccountinfo = {accountTransactionsIterated:[]};
var selected = null;
var CHANGE_EVENT = 'change';
var ActionTypes = AppConstants.ActionTypes;

function _setEntityKontoxAccountInfo(accountData) {
  if(accountData && accountData.accountInfo){
      var accountTransactionsIterated = [];
      if(accountData.accountTransactions){
        for( var j = 0; j < accountData.accountTransactions.length; j++){
          var resInner = accountData.accountTransactions[j];
          for( var k = 0; k < resInner.length; k++){
            accountTransactionsIterated.push(resInner[k]);
          }
        }
        accountData.accountTransactionsIterated = accountTransactionsIterated;
      }else{
        accountData.accountTransactions = [];
      }
     _entitykontoxaccountinfo = accountData;
  }else{
    _entitykontoxaccountinfo = {accountTransactionsIterated:[]}; 
  }
}

function _getEntityKontoxAccountInfo(dbid) {
    return _entitykontoxaccountinfo;
}

var KontoxStore = assign({}, EventEmitter.prototype, {
 
  getEntityKontoxAccountInfo: _getEntityKontoxAccountInfo,

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


KontoxStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_ENTITIES_KONTOX_ACCOUNT_INFO:
      _setEntityKontoxAccountInfo(action.entities_account);
      KontoxStore.emitChange();
      break;

    default:
     //nop
  }
});


export default KontoxStore;
