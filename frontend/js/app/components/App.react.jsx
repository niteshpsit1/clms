import React from 'react';

import MainSection from './MainSection.react';
import Sidebar from './Sidebar.react';
import Notifications from './Notifications.react';

import ServerActionCreator from '../actions/ServerActionCreator';
import ApiUtils from '../utils/ApiUtils';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.displayName = 'App';

    ServerActionCreator.receiveEntities();
    ServerActionCreator.receiveLoans();
    ServerActionCreator.receiveCollaterals();

    ServerActionCreator.receiveEntitiesRole();
    ServerActionCreator.receiveLoanType();
    ServerActionCreator.receiveDocumentType();
    //ServerActionCreator.receiveSearch();
    ApiUtils.getDocuments();

  }
  render () {

    return (
      <div className="app" id="wrapper">
        <Sidebar/>
        <MainSection routerChildren={this.props.children}/>
        <Notifications />
      </div>
    );
  }
}

export default App;
