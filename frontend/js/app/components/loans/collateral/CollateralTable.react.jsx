/**
 * Entity table: React Class
 *
 * Lists all people/organizations
 *
 * @author: Danyil Karuna
 * @created: 16/11/2015
 **/

import React from "react";
import CollateralStore from "../../../stores/CollateralStore";
import ServerActionCreator from "../../../actions/ServerActionCreator";

import Documents from "../../documents/Documents.react";

export default class CollateralTable extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      collateralsList: CollateralStore.getAll()
    };

    this._onChange = this._onChange.bind(this);

  }

  _onChange () {
    this.setState({collateralsList: CollateralStore.getAll()});
  }

  componentDidMount () {
    CollateralStore.addChangeListener(this._onChange);
  }

  componentWillUnmount () {
    CollateralStore.removeChangeListener(this._onChange);
  }

  handleDeleteClick (id) {
    ServerActionCreator.deleteCollateral(id);
  }

  render () {
    let filteredList = this.state.collateralsList.filter(value => value.loan_id == this.props.loanID);
    console.log(filteredList);
    return (
      <table id="collateral-table" className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Valuation</th>
            <th>Documents</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((item, i) => {
            return (
              <tr key={item.name + " " + item.id}>
                <td>{item.name}</td>
                <td>{item.valuation}</td>
                <td><Documents type="collateral" target={item.id}/></td>
                <td>
                  <button type="button" className="btn btn-danger" value="Delete" onClick={this.handleDeleteClick.bind(this, item.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
