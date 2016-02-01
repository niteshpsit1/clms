import App from './components/App.react';

import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, IndexRoute, Redirect } from 'react-router'
import History from './utils/History';

import EntityPanel from './components/entities/EntityPanel.react';
import ChatApp from './components/chat/ChatApp.react';
import LoansTable from './components/loans/LoansTable.react';
import NewLoan from './components/loans/NewLoan.react';
import LoanPanel from './components/loans/LoanPanel.react';
import AddEntity from './components/entities/AddEntity';

import EntitiesGrid from './components/entities/EntitiesGrid';
import LoanGrid from './components/loans/LoanGrid';


import NewEntityRole from './components/admin/entityrole/NewEntityRole.react';
import NewLoanType from './components/admin/loantype/NewLoanType.react';
import NewDocumentType from './components/admin/documenttype/NewDocumentType.react';
import DocumentTypeTable from './components/admin/documenttype/DocumentTypeTable.react';
import DocumentTypePanel from './components/admin/documenttype/DocumentTypePanel.react';
import EntityRolePanel from './components/admin/entityrole/EntityRolePanel.react';
import EntitiesRoleTable from './components/admin/entityrole/EntityRoleTable.react';
import LoanTypeTable from './components/admin/loantype/LoanTypeTable.react';
import LoanTypePanel from './components/admin/loantype/LoanTypePanel.react';
import SearchResult from './components/SearchResult.react';

ReactDOM.render(
  <Router history={History}>
    <Route path="/" component={App}>
      <IndexRoute component={EntitiesGrid} />

      <Route path="entities" component={EntitiesGrid} />
      <Route path="entities/new" component={AddEntity} />
      <Route path="entities/:id" component={EntityPanel} />

      <Route path="loans" component={LoanGrid} />
      <Route path="loans/new" component={NewLoan} />
      <Route path="loans/:id" component={LoanPanel} />

      <Route path="loans" component={LoansTable} />

      <Route path="userchat" component={ChatApp} />

      <Route path="entityrole" component={EntitiesRoleTable} />
      <Route path="entityrole/new" component={NewEntityRole} />
      <Route path="entityrole/:id" component={EntityRolePanel} />

      <Route path="loantype" component={LoanTypeTable} />
      <Route path="loantype/new" component={NewLoanType} />
      <Route path="loantype/:id" component={LoanTypePanel} />

      <Route path="document-type/new" component={NewDocumentType} />
      <Route path="document-type" component={DocumentTypeTable} />
      <Route path="document-type/:id" component={DocumentTypePanel} />

      <Route path="search" component={SearchResult} />

      <Redirect from="*" to="/" />

    </Route>
  </Router>,
  document.getElementById('app-mount-point')
);
