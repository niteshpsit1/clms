import React from "react";
import LinkedStateMixin from "react-addons-linked-state-mixin";
import EntityStore from "../../stores/EntityStore";
import ServerActionCreator from "../../actions/ServerActionCreator";
import ApiUtils from "../../utils/ApiUtils";



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