import React from 'react';
import ReactDOM from 'react-dom';

import LogoutButton from './LogoutButton.react';

class MainSection extends React.Component {
  constructor (props) {
    super(props);
    this.displayName = 'MainSection';
  }

  render () {
    return (
      <div id="page-wrapper" className="gray-bg dashbard-1">
        <div className="row border-bottom">
          <nav className="navbar navbar-static-top" role="navigation">
            <div className="navbar-header">
              <a className="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#">
                <i className="fa fa-bars"></i>
              </a>
              <form role="search" className="navbar-form-custom" action="/search">
                <div className="form-group">
                  <input type="text" placeholder="Search for something..." className="form-control" name="top-search" id="top-search"/>
                </div>
              </form>
            </div>
            <ul className="nav navbar-top-links navbar-right">
              <li>
                <span className="m-r-sm text-muted welcome-message">Portal de Gestión de Créditos</span>
              </li>
              <li id="logoutButton"><LogoutButton/></li>

            </ul>

          </nav>
        </div>
        <div className="row dashboard-header">
          <div className="col-xs-12">
            {this.props.routerChildren}
          </div>
        </div>
      </div>
    );
  }
}

export default MainSection;
