import React from "react";
import LinkedStateMixin from "react-addons-linked-state-mixin";
import ServerActionCreator from "../../../actions/ServerActionCreator";

import LoanTypeStore from "../../../stores/LoanTypeStore";
import DocumentStore from "../../../stores/DocumentStore";

import ApiUtils from "../../../utils/ApiUtils";
import History from "../../../utils/History";

import Documents from "../../documents/Documents.react";
import DocumentsUploader from "../../documents/DocumentsUploader.react";



var DynamicData = React.createClass({

  mixins: [LinkedStateMixin],

  getState() {
    var ce = LoanTypeStore.getByID(this.props.id);
    var documents = ce.data.keyelement;
    return {
      value: jQuery.extend(true, {}, ce.data.keyelement),
      edited: false,
      loading: false
    };
  },

  getInitialState: function() {
    return this.getState();
  },

  componentDidMount: function() {
    this.setState({value: jQuery.extend(true, {}, this.props.data)});
  },

  makeLink: function(key , i) {
    var _self = this;
    return {

      value: (key.indexOf("data") > -1
        ? this.state.value[i].data[key.split("-")[1]]
        : this.state.value[i].value),

      requestChange: function(newValue) {
        var value = _self.state.value;
        var edited = _self.props.valueLink.value;
        if (key.indexOf("data") > -1) {
          value.data[key.split("-")[1]] = newValue;
        } else {
          value[i].value = newValue;
        }
        _self.setState({value: value});
        _self.props.valueLink.requestChange('true');

      }
    }
  },

    render: function() {
      var currentThis = this;
        var dynamicComponents = this.props.data.map(function(data, i) {
            return (<div className="form-group" key={i}><label className="col-sm-4 control-label"  key={i} htmlFor="updateLoanTypeForm-value">{data.key} :</label>
				  	<div className="col-sm-6">
				    	<input type="text"  key={i} id={data.key} className="form-control" valueLink={currentThis.makeLink('value',i)} />
				  	</div>
				  	</div>);
        });
        return <div>{dynamicComponents}</div>;
    }
});



var LoanTypePanel = React.createClass({

  mixins: [LinkedStateMixin],

  getStateFromStores() {
    var ce = LoanTypeStore.getByID(this.props.params.id);
    return {
      currentEntity: ce,
      newEntity: jQuery.extend(true, {}, ce),
      edited: false,
      entityName: (ce != null
        ? ce.name
        : ''),
      loading: false
    };
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  componentDidMount: function() {
    LoanTypeStore.addChangeListener(this._onChange);
  },

  componentsWillUnmount: function() {
    LoanTypeStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(this.getStateFromStores());
  },

  handleDeleteClick: function() {

    ServerActionCreator.deleteLoanType(this.state.currentEntity.id);

  },

  handleCancelClick: function() {
    if (!this.state.edited) {
      return false;
    }
    this.setState({
      currentEntity: LoanTypeStore.getByID(this.props.id),
      edited: false
    });
    this._onChange();
  },

  handleSaveClick: function() {
    if (!this.state.edited) {
      return false;
    }
    var keyelement = [];
    if (this.state.currentEntity.data !== null) {
      
      for(var i = 0; i < this.state.currentEntity.data.keyelement.length; i++){
        var key = this.state.currentEntity.data.keyelement[i].key;
        if( key !== undefined) {
        var value = $('#'+ key ).val();
        var countkey = {key: key, value: value};
        keyelement.push(countkey);
        }
      }
    }

    var formData = {
      id: this.state.currentEntity.id,
      code: $('#updateLoanTypeForm-code').val(),
      descrption: $('#updateLoanTypeForm-descrption').val(),
      payment_cycle: $('#updateLoanTypeForm-payment_cycle').val(),
      loan_system: $('#updateLoanTypeForm-loan_system').val(),
      data: {
        keyelement
      }
    };

    if (formData.code) {
      ServerActionCreator.editLoanType(JSON.stringify(formData));
    }

  },

  makeValueLink: function(key) {
    var _self = this;
    return {

      value: (key.indexOf("data") > -1
        ? this.state.newEntity.data[key.split("-")[1]]
        : this.state.newEntity[key]),

      requestChange: function(newValue) {
        var newEntity = _self.state.newEntity;
        if (key.indexOf("data") > -1) {
          newEntity.data[key.split("-")[1]] = newValue;
        } else {
          newEntity[key] = newValue;
        }
        _self.setState({newEntity: newEntity, edited: true});
      }
    }
  },

  render: function() {
    if (this.state.currentEntity.data !== null) {
      return (
      	<div className="panel-body">
	      <div className="row">
	        <div>
	          <form className="form-horizontal" id="updateLoanTypeForm" name="updateLoanTypeForm">
	            <div className="row">

	              <div className="col-md-6">
	              <div className="panel panel-default">
	                <div className="panel-heading">New EntityRole</div>
	                <div className="panel-body">

	                <div className="form-group">
	                  <label className="col-sm-4 control-label" htmlFor="updateLoanTypeForm-code">Code:</label>
	                  <div className="col-sm-8">
	                    <input type="text" id="updateLoanTypeForm-code" className="form-control" valueLink={this.makeValueLink('code')} required />
	                  </div>
	                </div>

	                <div className="form-group">
	                  <label className="col-sm-4 control-label" htmlFor="updateLoanTypeForm-descrption">Description:</label>
	                  <div className="col-sm-8">
	                    <input type="text" id="updateLoanTypeForm-descrption" className="form-control" valueLink={this.makeValueLink('descrption')} />
	                  </div>
	                </div>

	                <div className="form-group">
	                  <label className="col-sm-4 control-label" htmlFor="updateLoanTypeForm-payment_cycle">Payment Cycle:</label>
	                  <div className="col-sm-8">
	                    <input type="text" id="updateLoanTypeForm-payment_cycle" className="form-control" valueLink={this.makeValueLink('payment_cycle')} />
	                  </div>
	                </div>

	                <div className="form-group">
	                  <label className="col-sm-4 control-label" htmlFor="updateLoanTypeForm-loan_system">Loan System:</label>
	                  <div className="col-sm-8">
	                    <input type="text" id="updateLoanTypeForm-loan_system" className="form-control" valueLink={this.makeValueLink('loan_system')} />
	                  </div>
	                </div>
	                </div>
	              </div>
	              </div>

	              <div className="col-md-6">
              		<div className="panel panel-default">
                		<div className="panel-heading">Details</div>
                			<div className="panel-body">
                				<div className="form-group">
                					<DynamicData data = {this.state.currentEntity.data.keyelement} id = {this.state.currentEntity.id} valueLink={this.linkState('edited')}/>
			    				      </div>
                			</div>
              			</div>
              		</div>

	            </div>

	            <div className="row">
	                <button type="button" className="btn btn-danger" defaultValue="Delete" onClick={this.handleDeleteClick}>Delete</button>
	                <div className="pull-right">
	                  <button type="button" className={(!this.state.edited
	                    ? "disabled"
	                    : "") + " btn btn-default"} defaultValue="Cancel" onClick={this.handleCancelClick}>Cancel</button>
	                  <button type="button" className={(!this.state.edited
	                    ? "disabled"
	                    : "") + " btn btn-primary"} defaultValue="Save" onClick={this.handleSaveClick}>Save</button>
	                </div>
	              </div>
	          </form>
	        </div>

	      </div>
	    </div>
      );

    } else {
      return (
        <div className="panel-body">
        <div className="row">
          <div>
            <form className="form-horizontal" id="updateLoanTypeForm" name="updateLoanTypeForm">
              <div className="row">

                <div className="col-md-6">
                <div className="panel panel-default">
                  <div className="panel-heading">New EntityRole</div>
                  <div className="panel-body">

                  <div className="form-group">
                    <label className="col-sm-4 control-label" htmlFor="updateLoanTypeForm-code">Code:</label>
                    <div className="col-sm-8">
                      <input type="text" id="updateLoanTypeForm-code" className="form-control" valueLink={this.makeValueLink('code')} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="col-sm-4 control-label" htmlFor="updateLoanTypeForm-descrption">Description:</label>
                    <div className="col-sm-8">
                      <input type="text" id="updateLoanTypeForm-descrption" className="form-control" valueLink={this.makeValueLink('descrption')} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="col-sm-4 control-label" htmlFor="updateLoanTypeForm-payment_cycle">Payment Cycle:</label>
                    <div className="col-sm-8">
                      <input type="text" id="updateLoanTypeForm-payment_cycle" className="form-control" valueLink={this.makeValueLink('payment_cycle')} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="col-sm-4 control-label" htmlFor="updateLoanTypeForm-loan_system">Loan System:</label>
                    <div className="col-sm-8">
                      <input type="text" id="updateLoanTypeForm-loan_system" className="form-control" valueLink={this.makeValueLink('loan_system')} />
                    </div>
                  </div>
                  </div>
                </div>
                </div>

                

              </div>

              <div className="row">
                  <button type="button" className="btn btn-danger" defaultValue="Delete" onClick={this.handleDeleteClick}>Delete</button>
                  <div className="pull-right">
                    <button type="button" className={(!this.state.edited
                      ? "disabled"
                      : "") + " btn btn-default"} defaultValue="Cancel" onClick={this.handleCancelClick}>Cancel</button>
                    <button type="button" className={(!this.state.edited
                      ? "disabled"
                      : "") + " btn btn-primary"} defaultValue="Save" onClick={this.handleSaveClick}>Save</button>
                  </div>
                </div>
            </form>
          </div>

        </div>
      </div>
      );
    }

  }

});

export default LoanTypePanel;
