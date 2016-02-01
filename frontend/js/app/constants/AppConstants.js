var keyMirror = require('keymirror');

module.exports = {

  ActionTypes: keyMirror({
    NEW_ENTITY: null,
    ENTITY_REMOVE: null,
    ENTITY_EDIT: null,
    RECEIVE_ENTITIES: null,
    RECEIVE_ENTITIES_KONTOX_ACCOUNT_INFO: null,

    NEW_LOAN: null,
    LOAN_REMOVE: null,
    LOAN_EDIT: null,
    RECEIVE_LOANS: null,

    NEW_COLLATERAL: null,
    REMOVE_COLLATERAL: null,
    RECEIVE_COLLATERALS: null,

    NEW_DOCUMENT: null,
    DOCUMENT_REMOVE: null,
    RECEIVE_DOCUMENTS: null,
    RECEIVE_DOC_ENTITY_LINKS: null,
    RECEIVE_DOC_LOAN_LINKS: null,
    RECEIVE_DOC_COLLATERAL_LINKS: null,

    CHANGE_TAB: null,
    REGISTER_TAB: null,

    GET_TABLE_RECORDS : null,
    NEW_ENTITYROLE: null,
    ENTITY_EDITROLE: null,
    ENTITYROLE_REMOVE: null,
    RECEIVE_ENTITYSROLE: null,

    NEW_LOANTYPE: null,
    LOANTYPE_EDIT: null,
    LOANTYPE_REMOVE: null,
    RECEIVE_LOANTYPE: null,

    NEW_DOCUMENTTYPE: null,
    DOCUMENTTYPE_EDIT: null,
    DOCUMENTTYPE_REMOVE: null,
    RECEIVE_DOCUMENTTYPE: null
  })

};
