// Frontend related settings
var frontendSettings = function () {

  return {

    // Generic settings
    serverAddr: "http://localhost:3003",

    // Endpoints
    endpoints: {
      login: "api/v1/user/login",
      logout: "api/v1/user/app/logout/",

      users: "/api/v1/user",

      entities: "/api/v1/entity",
      entityDocument: "/api/v1/entity-document",
      documentsForEntity: "/api/v1/entity-document/for-entity/",
      entityKontoxAccountInfo: "/api/v1/kontox/account-info/for-entity/",

      loans: "/api/v1/loan",
      loanDocument: "/api/v1/loan-document",
      documentsForLoan: "/api/v1/loan-document/for-loan/",

      collaterals: "/api/v1/collateral",
      collateralDocument: "/api/v1/collateral-document",
      documentsForCollateral: "/api/v1/collateral-document/for-collateral/",

      loansEntity: "/api/v1/loans/for-entity/",

      documents: "/api/v1/document",
      documentsEntity: "/api/v1/document/for-entity/",

      documentTypes: "/api/v1/document-type",
      search: "/api/search",

      listo: "api/listo"
    },

    // Used for date format
    locale: "es-MX"

  };

}();
