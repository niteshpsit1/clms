import React from "react";
import ServerActionCreator from "../../../actions/ServerActionCreator";
import ApiUtils from "../../../utils/ApiUtils";
import DocumentsUploader from "../../documents/DocumentsUploader.react";

export default class NewCollateral extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      collateral: {
        name: '',
        data: {}
      }
    };

    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  handleSaveClick (event) {

    event.preventDefault();

    let formData = {
      name: $('#newCollateralForm-name').val(),
      valuation: $('#newCollateralForm-valuation').val(),
      loan_id: this.props.loanID,
      entity_id: this.props.entityID
    };

    console.log(formData);

    // Otherwise the HTML5 validation will just do the job for us
    if (formData.name) {
      ServerActionCreator.newCollateral(formData, id => {
        this.refs.uploader.setTarget(id);
        this.refs.uploader.upload();
      });
    }

  }

  render () {
    return <div className="panel-body">
      <div className="row">
        <div>
          <div className="form-horizontal" id="newCollateralForm" name="newCollateraForm">
            <h3 className="btn-righticon">
              <i className="fa fa-users">
                New Collateral:</i>
            </h3>

            <div className="row">

              <div className="col-md-12">
                <div className="panel panel-default">
                  <div className="panel-heading">New Collateral:</div>
                  <div className="panel-body">
                    <div className="form-group">
                      <label className="col-sm-4 control-label" htmlFor="newCollateralForm-name">Name:</label>
                      <div className="col-sm-8">
                        <input type="text" id="newCollateralForm-name" className="form-control" required/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-sm-4 control-label" htmlFor="newCollateralForm-valuation">Valuation:</label>
                      <div className="col-sm-8">
                        <input type="text" id="newCollateralForm-valuation" className="form-control" required/>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <DocumentsUploader ref="uploader" type="collateral"/>
            </div>

            <div className="row">
              <div className="col-md-2 col-md-offset-10">
                <span className="pull-right">
                  <button type="submit" className="btn btn-lg btn-primary" onClick={this.handleSaveClick}>
                    <i className="fa fa-save"></i>
                    Create
                  </button>
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>;

  }

}
