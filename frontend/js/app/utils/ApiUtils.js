import ServerActionCreator from '../actions/ServerActionCreator';

import EntityStore from '../stores/EntityStore';
import LoanStore from '../stores/LoanStore';

function _getEntities(_callback) {
  $.ajax({
    type: 'GET',
    url: frontendSettings.endpoints.entities,
    data: '',
    dataType: 'json',

    beforeSend: function(xhr) {
      xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
    },



    success: _callback,

    error: function(result) {
      console.log("error:");
      console.log(result);
      if (result.status === 403) {
        window.location.replace("/login.html");
      }
    }

  });
}

function _getLoans(_callback) {
  $.ajax({
    type: 'GET',
    url: frontendSettings.endpoints.loans,
    data: '',
    dataType: 'json',

    beforeSend: function(xhr) {
      xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
    },

    success: _callback,

    error: function(result) {
      console.log("error:");
      console.log(result);
      if (result.status === 403) {
        window.location.replace("/login.html");
      }
    }

  });
}

function _getDocuments() {
  $.ajax({
    type: 'GET',
    async: false,
    url: frontendSettings.endpoints.documents,
    data: '',
    dataType: 'json',

    beforeSend: function(xhr) {
      xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
    },

    success: function(result) {
      ServerActionCreator.receiveDocuments(result.result);
      _getDocLoanLinks();
      _getDocEntityLinks();
      _getDocCollateralLinks();
    },

    error: function(result) {
      console.log("error:");
      console.log(result);
      if (result.status === 403) {
        window.location.replace("/login.html");
      }
    }

  });
}

function _getCollaterals(_callback) {
  $.ajax({
    type: 'GET',
    url: frontendSettings.endpoints.collaterals,
    data: '',
    dataType: 'json',

    beforeSend: function(xhr) {
      xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
    },

    success: _callback,

    error: function(result) {
      console.log("error:");
      console.log(result);
      if (result.status === 403) {
        window.location.replace("/login.html");
      }
    }

  });
}

function _getDocuments() {
  $.ajax({
    type: 'GET',
    async: false,
    url: frontendSettings.endpoints.documents,
    data: '',
    dataType: 'json',

    beforeSend: function(xhr) {
      xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
    },

    success: function(result) {
      ServerActionCreator.receiveDocuments(result.result);
      _getDocLoanLinks();
      _getDocEntityLinks();
      _getDocCollateralLinks();
    },

    error: function(result) {
      console.log("error:");
      console.log(result);
      if (result.status === 403) {
        window.location.replace("/login.html");
      }
    }

  });
}

function _getDocLoanLinks() {
  $.ajax({
    type: 'GET',
    async: false,
    url: frontendSettings.endpoints.loanDocument,
    data: '',
    dataType: 'json',

    beforeSend: function(xhr) {
      xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
    },

    success: function(result) {
      ServerActionCreator.receiveDocLoanLinks(result.result);
    },

    error: function(result) {
      console.log("error:");
      console.log(result);
      if (result.status === 403) {
        window.location.replace("/login.html");
      }
    }

  });
}

function _getDocEntityLinks() {
  $.ajax({
    type: 'GET',
    async: false,
    url: frontendSettings.endpoints.entityDocument,
    data: '',
    dataType: 'json',

    beforeSend: function(xhr) {
      xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
    },

    success: function(result) {
      ServerActionCreator.receiveDocEntityLinks(result.result);
    },

    error: function(result) {
      console.log("error:");
      console.log(result);
      if (result.status === 403) {
        window.location.replace("/login.html");
      }
    }

  });
}

function _getDocCollateralLinks() {
  $.ajax({
    type: 'GET',
    async: false,
    url: frontendSettings.endpoints.collateralDocument,
    data: '',
    dataType: 'json',

    beforeSend: function(xhr) {
      xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
    },

    success: function(result) {
      ServerActionCreator.receiveDocCollateralLinks(result.result);
    },

    error: function(result) {
      console.log("error:");
      console.log(result);
      if (result.status === 403) {
        window.location.replace("/login.html");
      }
    }

  });
}

function _getEntitiesRole(_callback) {
  $.ajax({
    type: 'GET',
    url: frontendSettings.endpoints.entityRole,
    data: '',
    dataType: 'json',

    beforeSend: function(xhr) {
      xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
    },



    success: _callback,

    error: function(result) {
      console.log("error:");
      console.log(result);
      if (result.status === 403) {
        window.location.replace("/login.html");
      }
    }

  });
}

function _gerLoanType(_callback) {
  $.ajax({
    type: 'GET',
    url: frontendSettings.endpoints.loanType,
    data: '',
    dataType: 'json',

    beforeSend: function(xhr) {
      xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
    },



    success: _callback,

    error: function(result) {
      console.log("error:");
      console.log(result);
      if (result.status === 403) {
        window.location.replace("/login.html");
      }
    }

  });
}

function _gerDocumentType(_callback) {
  $.ajax({
    type: 'GET',
    url: frontendSettings.endpoints.documentTypes,
    data: '',
    dataType: 'json',

    beforeSend: function(xhr) {
      xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
    },



    success: _callback,

    error: function(result) {
      console.log("error:");
      console.log(result);
      if (result.status === 403) {
        window.location.replace("/login.html");
      }
    }

  });
}

function _search(value, _callback) {

  $.ajax({
    type: 'GET',
    url: frontendSettings.endpoints.search,
    data: {
      name:value
    },
    dataType: 'json',

    beforeSend: function(xhr) {
      xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
    },



    success: _callback,

    error: function(result) {
      console.log("error:");
      console.log(result);
      if (result.status === 403) {
        window.location.replace("/login.html");
      }
    }

  });
}


export default {
  getEntities: _getEntities,

  getLoans: _getLoans,

  getDocuments: _getDocuments,

  getCollaterals: _getCollaterals,

  getEntitiesRole: _getEntitiesRole,

  gerLoanType: _gerLoanType,

  gerDocumentType: _gerDocumentType,

  search: _search,

  newEntity: function(formData, _callback) {
    $.ajax({
      type: 'POST',
      url: frontendSettings.endpoints.entities,
      contentType: 'application/json; charset=UTF-8',
      data: formData,
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: _callback,

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  editEntity: function(formData, _callback) {
    $.ajax({
      type: 'PUT',
      contentType: 'application/json; charset=UTF-8',
      url: frontendSettings.endpoints.entities,
      data: formData,
      dataType: 'json',

      success: _callback,

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      },

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      }
    })
  },

  deleteEntity: function(id, _callback) {
    $.ajax({
      type: 'DELETE',
      url: frontendSettings.endpoints.entities,
      data: {
        id: id
      },
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: () => {
        _callback(null, "deleted entity")
      },

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  saveEntity : function(formData,_callback){
      $.ajax({
        type: 'POST',
        url: frontendSettings.endpoints.entities,
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(formData),
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
        }
      }).done((data)=>{
          _callback(null,data);
      }).fail((jqXhr)=>{
        if(jqXhr.status===403){
          window.location.replace('/login.html');
        }
        else{
          var json = jqXhr.responseJSON;
          if(json.error){
            _callback(json,null);
          }
        }
      });
  },

  getRecords : function(recordType,_callback){
    var url = null;
    switch(recordType){
      case 'entity':
        url = frontendSettings.endpoints.entities;
      break;
      case 'loan':
        url = frontendSettings.endpoints.loans;
      break;
    }

    $.ajax({
      type: 'GET',
      url: url,
      data: '',
      dataType: 'json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      }
    }).done((data)=>{
      _callback(null,data);
    }).fail((jqXhr)=>{
      if(jqXhr.status===403){
        window.location.replace('/login.html');
      }
      else{
        _callback(jqXhr,null);
      }
    });
  },

  newLoan: function(formData, _callback) {
    $.ajax({
      type: 'POST',
      url: frontendSettings.endpoints.loans,
      data: formData,
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: _callback,

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  editLoan: function(formData, _callback) {
    $.ajax({
      type: 'PUT',
      url: frontendSettings.endpoints.loans,
      data: formData,
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: _callback,

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }

    });
  },

  deleteLoan: function(id, _callback) {
    $.ajax({
      type: 'DELETE',
      url: frontendSettings.endpoints.loans,
      data: {
        id: id
      },
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: (result) => {
        console.log(result);
        _callback(null, "deleted loan")
      },

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  newCollateral: function(formData, _callback) {
    $.ajax({
      type: 'POST',
      url: frontendSettings.endpoints.collaterals,
      data: formData,
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: _callback,

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  deleteCollateral: function(id, _callback) {
    $.ajax({
      type: 'DELETE',
      url: frontendSettings.endpoints.collaterals,
      data: {
        id: id
      },
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: () => {
        _callback(null, "deleted collateral")
      },

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  deleteDocument: function(document, _callback) {
    $.ajax({
      type: 'DELETE',
      url: frontendSettings.endpoints.documents,
      data: {
        id: document.id
      },
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: _callback,

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  deleteDocumentsForEntity: function(entityID, _callback) {
    $.ajax({
      type: 'DELETE',
      url: frontendSettings.endpoints.documentsForEntity + entityID,
      data: {
        entity_id: entityID
      },
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: () => {
        _callback(null, 'deleted documents for entity')
      },

      error: function(result) {
        if (result.status === 404) {
          if (_callback !== undefined) {
            _callback(null, 'deleted documents for entity');
          }
          return true;
        }
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  deleteDocumentsForLoan: function(loanID, _callback) {
    $.ajax({
      type: 'DELETE',
      url: frontendSettings.endpoints.documentsForLoan + loanID,
      data: {
        loan_id: loanID
      },
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: () => {
        _callback(null, 'deleted documents for loan')
      },

      error: function(result) {
        if (result.status === 404) {
          if (_callback !== undefined) {
            _callback(null, 'deleted documents for loan');
          }
          return false;
        }
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  deleteDocumentsForCollateral: function(collateralID, _callback) {
    $.ajax({
      type: 'DELETE',
      url: frontendSettings.endpoints.documentsForCollateral + collateralID,
      data: {
        collateral_id: collateralID
      },
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: () => {
        _callback(null, 'deleted documents for collateral')
      },

      error: function(result) {
        if (result.status === 404) {
          if (_callback !== undefined) {
            _callback(null, 'deleted documents for collateral');
          }
          return false;
        }
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },
//=========================================================================
  newEntityRole: function(formData, _callback) {
    $.ajax({
      type: 'POST',
      url: frontendSettings.endpoints.entityRole,
      contentType: 'application/json; charset=UTF-8',
      data: formData,
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: _callback,

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  editEntityRole: function(formData, _callback) {
    $.ajax({
      type: 'PUT',
      contentType: 'application/json; charset=UTF-8',
      url: frontendSettings.endpoints.entityRole,
      data: formData,
      dataType: 'json',

      success: _callback,

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      },

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      }
    })
  },

  deleteEntityRole: function(id, _callback) {
    $.ajax({
      type: 'DELETE',
      url: frontendSettings.endpoints.entityRole,
      data: {
        id: id
      },
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: () => {
        _callback(null, "deleted entity")
      },

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  //=========================================================
  newLoanType: function(formData, _callback) {
    $.ajax({
      type: 'POST',
      url: frontendSettings.endpoints.loanType,
      contentType: 'application/json; charset=UTF-8',
      data: formData,
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: _callback,

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  editLoanType: function(formData, _callback) {
    $.ajax({
      type: 'PUT',
      contentType: 'application/json; charset=UTF-8',
      url: frontendSettings.endpoints.loanType,
      data: formData,
      dataType: 'json',

      success: _callback,

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      },

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      }
    })
  },

  deleteLoanType: function(id, _callback) {
    $.ajax({
      type: 'DELETE',
      url: frontendSettings.endpoints.loanType,
      data: {
        id: id
      },
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: () => {
        _callback(null, "deleted entity")
      },

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  //=========================================================
  newDocumentType: function(formData, _callback) {
    $.ajax({
      type: 'POST',
      url: frontendSettings.endpoints.documentType,
      contentType: 'application/json; charset=UTF-8',
      data: formData,
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: _callback,

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  editDocumentType: function(formData, _callback) {
    $.ajax({
      type: 'PUT',
      contentType: 'application/json; charset=UTF-8',
      url: frontendSettings.endpoints.documentType,
      data: formData,
      dataType: 'json',

      success: _callback,

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      },

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      }
    })
  },

  deleteDocumentType: function(id, _callback) {
    $.ajax({
      type: 'DELETE',
      url: frontendSettings.endpoints.documentType,
      data: {
        id: id
      },
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: () => {
        _callback(null, "deleted entity")
      },

      error: function(result) {
        console.log("error:");
        console.log(result);
        if (result.status === 403) {
          window.location.replace("/login.html");
        }
      }
    });
  },

  getKontoxAccountInfo: function(entity_id, _callback) {
    $.ajax({
      type: 'GET',
      url: frontendSettings.endpoints.entityKontoxAccountInfo + entity_id,
      data: '',
      dataType: 'json',

      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
      },

      success: function(result) {
        // ServerActionCreator.receiveKontoxAccountInfo(result.result);
        _callback(result);
      },

      error: function(result) {
        console.log("error:");
        console.log(result);
        // if (result.status === 403) {
        //   window.location.replace("/login.html");
        // }
        _callback(result);
      }

    });
  }
};
