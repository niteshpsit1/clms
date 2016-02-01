import React from 'react';

import EntitiesMenuItem from './entities/EntitiesMenuItem.react';
import LoansMenuItem from './loans/LoansMenuItem.react';
import TasksMenuItem from './tasks/TasksMenuItem.react';
import ActivityHistoryMenuItem from './activities/ActivityHistory.rect';
import AdminMenuItem from './admin/AdminMenuItem.react';
import ChatMenuItem from './chat/ChatMenuItem.react';
import History from "../utils/History";
 
class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.displayName = 'Sidebar';
    }

    toLandingPage(event) {
        History.pushState(null, "/");
        event.preventDefault();
    }

    render() {
        return (
          <nav className="navbar-default navbar-static-side" role="navigation">
            <div className="sidebar-collapse">
                <ul className="nav leftMenu" id="side-menu">
                    <li className="nav-header">
                        <div className="dropdown profile-element"> <span>
                                <img alt="image" className="main-logo" src="/img/logo.png" onClick={this.toLandingPage}/>
                                 </span>
                            <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                                <span className="clear"> <span className="block m-t-xs"> <strong className="font-bold">{JSON.parse(sessionStorage.getItem('user')).name}</strong>
                                 </span> <span className="text-muted text-xs block">Dummy Text <b className="caret"></b></span> </span> </a>
                            <ul className="dropdown-menu animated fadeInRight m-t-xs">
                                <li><a href="#">Dummy Text</a></li>
                                <li><a href="#">Dummy Text</a></li>
                                <li><a href="#">Dummy Text</a></li>

                            </ul>
                        </div>
                        <div className="logo-element">
                            BT
                        </div>
                    </li>
                    <EntitiesMenuItem />
                    <LoansMenuItem />
                    <ActivityHistoryMenuItem />
                    <AdminMenuItem />
                    <ChatMenuItem />

          </ul>
        </div>
      </nav>
    );
  }
}

export default Sidebar;
