import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import ApiUtils from '../utils/ApiUtils';

import EntityStore from '../stores/EntityStore';
import KontoxStore from '../stores/KontoxStore';
import DocumentStore from '../stores/DocumentStore';

import async from 'async';

var ActionTypes = AppConstants.ActionTypes;

export default {

  newEntity: function(formData) {
    ApiUtils.newEntity(formData, function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.NEW_ENTITY,
        data: result.result
      });
    });
  },

  editEntity: function(formData) {
    ApiUtils.editEntity(formData, function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.ENTITY_EDIT,
        data: result.result
      });
    });
  },

  deleteEntity: function(id) {
    async.series([
      function(cb) {
        ApiUtils.deleteDocumentsForEntity(id, cb);
      },

      function(cb) {
        ApiUtils.deleteEntity(id, cb);
      },

      function(cb) {
        AppDispatcher.dispatch({
          type: ActionTypes.ENTITY_REMOVE,
          id: id
        });
        cb(null, 'dispatched event');
      }
    ]);
  },

  newLoan: function(formData) {
    ApiUtils.newLoan(formData, function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.NEW_LOAN,
        data: result.result
      });
    });
  },

  editLoan: function(formData) {
    ApiUtils.editLoan(formData, function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.LOAN_EDIT,
        data: result.result
      });
    });
  },

  deleteLoan: function(id) {
    async.series([
      function(cb) {
        ApiUtils.deleteDocumentsForLoan(id, cb);
      },

      function(cb) {
        ApiUtils.deleteLoan(id, cb);
      },

      function(cb) {
        AppDispatcher.dispatch({
          type: ActionTypes.LOAN_REMOVE,
          id: id
        });
        cb(null, 'dispatched event');
      }
    ]);
  },

  newDocument: function(doc) {
    AppDispatcher.dispatch({
      type: ActionTypes.NEW_DOCUMENT,
      document: doc
    });
  },

  deleteDocument: function(doc) {
    ApiUtils.deleteDocument(doc, function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.DOCUMENT_REMOVE,
        id: doc.id
      });
    });
  },


  newCollateral: function(formData, _callback) {
    ApiUtils.newCollateral(formData, function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.NEW_COLLATERAL,
        data: result.result
      });
      if (_callback !== undefined) {
        _callback(result.result.id);
      }
    });
  },

  deleteCollateral: function(id) {
    async.series([
      function(cb) {
        ApiUtils.deleteDocumentsForCollateral(id, cb);
      },

      function(cb) {
        ApiUtils.deleteCollateral(id, cb);
      },

      function(cb) {
        AppDispatcher.dispatch({
          type: ActionTypes.COLLATERAL_REMOVE,
          id: id
        });
        cb(null, 'dispatched event');
      }
    ]);
  },

  receiveEntities: function() {
    ApiUtils.getEntities(function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_ENTITIES,
        entities: result.result
      });
    });
  },

  receiveKontoxAccountInfo: function(entityId) {
    ApiUtils.getKontoxAccountInfo(entityId, function(result){
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_ENTITIES_KONTOX_ACCOUNT_INFO,
        entities_account: (result.accountInfo ? result: [])
      }); 
    });
  },

  receiveLoans: function() {
    ApiUtils.getLoans(function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_LOANS,
        loans: result.result
      });
    });
  },

  receiveDocuments: function(receivedDocs) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_DOCUMENTS,
      documents: receivedDocs
    });
  },

  receiveCollaterals: function() {
    ApiUtils.getCollaterals(function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_COLLATERALS,
        collaterals: result.result
      });
    });
  },

  receiveDocLoanLinks: function(receivedLinks) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_DOC_LOAN_LINKS,
      links: receivedLinks
    });
  },

  receiveDocEntityLinks: function(receivedLinks) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_DOC_ENTITY_LINKS,
      links: receivedLinks
    });
  },

  receiveDocCollateralLinks: function(receivedLinks) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_DOC_COLLATERAL_LINKS,
      links: receivedLinks
    });
  },

//=========================================================================================
  receiveEntitiesRole: function() {
    ApiUtils.getEntitiesRole(function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_ENTITYSROLE,
        entities: result.result
      });
    });
  },

  newEntityRole: function(formData) {
    ApiUtils.newEntityRole(formData, function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.NEW_ENTITYROLE,
        data: result.result
      });
    });
  },

  editEntityRole: function(formData) {
    ApiUtils.editEntityRole(formData, function(result) { 
      AppDispatcher.dispatch({
        type: ActionTypes.ENTITY_EDITROLE,
        data: result.result
      });
    });
  },

  deleteEntityRole: function(id) {
    async.series([

      function(cb) {
        ApiUtils.deleteEntityRole(id, cb);
      },

      function(cb) {
        AppDispatcher.dispatch({
          type: ActionTypes.ENTITYROLE_REMOVE,
          id: id
        });
        cb(null, 'dispatched event');
      }
    ]);
  },
//===================================================================
  receiveLoanType: function() {
    ApiUtils.gerLoanType(function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_LOANTYPE,
        entities: result.result
      });
    });
  },

  newLoanType: function(formData) {
    ApiUtils.newLoanType(formData, function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.NEW_LOANTYPE,
        data: result.result
      });
    });
  },

  editLoanType: function(formData) {
    ApiUtils.editLoanType(formData, function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.LOANTYPE_EDIT,
        data: result.result
      });
    });
  },

  deleteLoanType: function(id) {
    async.series([

      function(cb) {
        ApiUtils.deleteLoanType(id, cb);
      },

      function(cb) {
        AppDispatcher.dispatch({
          type: ActionTypes.LOANTYPE_REMOVE,
          id: id
        });
        cb(null, 'dispatched event');
      }
    ]);
  },

//===================================================================
  receiveDocumentType: function() {
    ApiUtils.gerDocumentType(function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_DOCUMENTTYPE,
        entities: result.result
      });
    });
  },

  newDocumentType: function(formData) {
    ApiUtils.newDocumentType(formData, function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.NEW_DOCUMENTTYPE,
        data: result.result
      });
    });
  },

  editDocumentType: function(formData) {
    ApiUtils.editDocumentType(formData, function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.DOCUMENTTYPE_EDIT,
        data: result.result
      });
    });
  },

  deleteDocumentType: function(id) {
    async.series([

      function(cb) {
        ApiUtils.deleteDocumentType(id, cb);
      },

      function(cb) {
        AppDispatcher.dispatch({
          type: ActionTypes.DOCUMENTTYPE_REMOVE,
          id: id
        });
        cb(null, 'dispatched event');
      }
    ]);
  },

  receiveSearch: function(value) {
    ApiUtils.search(value, function(result) {
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_SEARCH,
        entities: result.result
      });
    });
  }

}
