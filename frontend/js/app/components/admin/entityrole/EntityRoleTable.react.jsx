/**
 * Entity table: React Class
 *
 * Lists all Entities roles
 *
 * @author: Ritesh Kumar
 * @created: 11/01/2016
 **/

import React from "react";
import EntityRoleStore from "../../../stores/EntityRoleStore";
import ServerActionCreator from "../../../actions/ServerActionCreator";
import History from "../../../utils/History";

let EntitiesRoleTable = React.createClass({
  getInitialState: function() {
    return {
      entitiesRoleList: EntityRoleStore.getAll(),
      show: this.props.location.query.show || 'role'
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({show: nextProps.location.query.show || 'role'});
  },

  _onChange: function() {
    this.setState({entitiesRoleList: EntityRoleStore.getAll()});
  },

  componentDidMount: function() {
    EntityRoleStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    EntityRoleStore.removeChangeListener(this._onChange);
  },

  rowClick: function(i) {
    History.pushState(null, '/entityrole/' + this.state.entitiesRoleList[i].id);
  },

  render: function() {
    return (
      <table id="entities-table" className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          {this.state.entitiesRoleList.map((item, i) => {
            if ((this.state.show == "role" && item.name) || (this.state.show != "role" && !item.name)) {
              return (
                <tr key={item.name + " " + item.id} onClick={this.rowClick.bind(this, i)}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    );
  }
});

export default EntitiesRoleTable;
