/**
 * New Loan Type creation: React Class
 * */

import React from "react";
import LinkedStateMixin from "react-addons-linked-state-mixin";
import EntityStore from "../../../stores/EntityStore";
import ServerActionCreator from "../../../actions/ServerActionCreator";
import ApiUtils from "../../../utils/ApiUtils";



var Field = React.createClass({
  handleClick: function(event) {
   event.preventDefault();
    var parentDiv = event.target.parentNode.parentNode;
    parentDiv.parentNode.removeChild(parentDiv);
  },
  render: function() {
    return (
	    <div>
	      <div className="input-prepend">
	        <div className="form-group">
	          <div className="col-sm-2" dangerouslySetInnerHTML={{__html: this.props.inputMarkup.newField}} />
	          <div className="col-sm-3" dangerouslySetInnerHTML={{__html: this.props.inputMarkup.newValue}} />
	        </div>
	      </div>
	      <a href="" className="delete" onClick={this.handleClick}>
	        <i className="icon icon-times"></i>
	      </a>
	    </div>
    );
  }
});

var FieldList = React.createClass({
  render: function() {
  	var fields = '';
  	if(this.props.fields) {
	    fields = this.props.fields.map(function (field, index) {
	      return (
	        <Field key={index} inputMarkup={field} />
	      );
	    });
	}
    return (
      <div className="field-list field-input">
        {fields}
      </div>
    );
  }
});




var DynamicFieldsAddition = React.createClass({
  getInitialState: function() {
    return {fields: []};
  },
  componentDidMount: function() {
    this.setState({fields: this.props.fields});
  },
  handleClick: function(event) {
    event.preventDefault();
    var fields = this.state.fields;
    var obj = {'newField':this.props.newField.outerHTML,'newValue':this.props.newValue.outerHTML};

    var newFields = fields.concat(obj);
    this.setState({fields: newFields});
  },
  render: function() {
    return (
      <div className="container">
        <FieldList fields={this.state.fields} />
        <a href="" className="bonus-field add" onClick={this.handleClick}>
          <i className="icon icon-plus"></i>
          {this.props.actionName}
        </a>
      </div>
    );
  }
});



var NewLoanType = React.createClass({

  mixins: [LinkedStateMixin],


  getInitialState: function () {
    return {
      loan_type: {
        code: '',
        description: '',
        payment_cycle: '',
        loan_system: '',
        data: {}
      },
      fields: [],
      count: 0
    };
  },

  componentWillMount: function () {
    if (this.isMounted()) {
      this.setState( {user: JSON.parse(sessionStorage.getItem('user'))} );
    }
  },

  componentDidMount: function() {
    this.setState({fields: this.props.fields});
    //this.setState({count: this.state.count + 1});
  },

  incrementCount: function (event) {
		this.setState({count: this.state.count + 1});
	},


  handleResetClick: function () {
    this.setState({
      loan_type: {
        code: '',
        description: '',
        payment_cycle: '',
        loan_system: '',
        data: {}
      },
      fields: [],
      count: 0
    });
  },

  handleSaveClick: function (event) {

    if (!$('#newLoanTypeForm')[0].checkValidity()) {
      return true;
    }

    event.preventDefault();

    var keyelement = [];
    for(var i = 0; i < this.state.count; i++){
    	var key = $('#key'+ i ).val();
    	if( key !== undefined) {
    	var value = $('#value'+ i ).val();
    	//var countkey = {[key]: value};
      var countkey = {key: key, value: value};
    	keyelement.push(countkey);
    	}
    }

     var formData = {
      code: $('#newLoanTypeForm-code').val(),
      descrption: $('#newLoanTypeForm-descrption').val(),
      payment_cycle: $('#newLoanTypeForm-payment_cycle').val(),
      loan_system: $('#newLoanTypeForm-loan_system').val(),
      data: {
      	keyelement
      }
    };

    if (formData.code && formData.payment_cycle && formData.loan_system) {
      ServerActionCreator.newLoanType(JSON.stringify(formData));
    }

  },

  render: function () {
  	var fields = [];
  	var i =  this.state.count;
  	var newField = document.createElement("input");
    newField.type = "text";
    newField.name = "key";
    newField.value = "key";
    newField.id = "key"+ i ;
    newField.className="form-control";
    newField.placeholder = "Title";

    var newValue = document.createElement("input");
    newValue.type = "text";
    newValue.name = "value";
    newValue.value = "value";
    newValue.id = "value"+ i;
    newValue.className="form-control";
    newValue.placeholder = "Detail";

    return <div className="panel-body">
      <div className="row">
        <div>
          <form className="form-horizontal" id="newLoanTypeForm" name="newLoanTypeForm">
            <div className="row">

              <div className="col-md-6">
              <div className="panel panel-default">
                <div className="panel-heading">New Loan Type</div>
                <div className="panel-body">

                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="newLoanTypeForm-code">Code:</label>
                  <div className="col-sm-8">
                    <input type="text" id="newLoanTypeForm-code" className="form-control" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="newLoanTypeForm-descrption">Description:</label>
                  <div className="col-sm-8">
                    <input type="text" id="newLoanTypeForm-descrption" className="form-control" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="newLoanTypeForm-payment_cycle">Payment Cycle:</label>
                  <div className="col-sm-8">
                    <input type="text" id="newLoanTypeForm-payment_cycle" className="form-control" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="newLoanTypeForm-loan_system">Loan System:</label>
                  <div className="col-sm-8">
                    <input type="text" id="newLoanTypeForm-loan_system" className="form-control" required />
                  </div>
                </div>
                </div>
              </div>
              </div>

	          <div className="col-md-6">
	            <div className="panel panel-default">
	            	<div className="panel-heading">Add Title and Detail</div>
	                	<div className="panel-body">
	                		<div className="form-group">
	                			<div id="content" onClick={this.incrementCount}>
	                				<DynamicFieldsAddition fields = {fields} newField = {newField} newValue = {newValue} actionName = 'Add' />
				    			</div>
				    		</div>
	                	</div>
	              	</div>
	            </div>

	        </div>

            <div className="row">
              <div className="col-md-2 col-md-offset-10">
              <span className="pull-right">
                <button type="submit" className="btn btn-lg btn-primary" onClick={this.handleSaveClick}>
                  <i className="fa fa-save"></i> Create
                </button>
              </span>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>;

  }

});


export default NewLoanType;
