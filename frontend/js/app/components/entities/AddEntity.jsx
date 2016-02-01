/**
  * AddPeople Class
  *
  * A derived class to add People
  *
  * Author     : Aruljothi Parthiban
  * Created At : 22/12/2015
 **/

import React from 'react';
import _ from 'lodash';
import Moment from 'moment';
import Panel from '../common/Panel';
import Alert from '../common/Alert';
import PanelBody from '../common/PanelBody';
import AddEntityActions from '../../actions/AddEntityActions';
import AddEntityStore from '../../stores/AddEntityStore';
import History from "../../utils/History";
import Validator from "../../validator";

class PanelTitle extends React.Component{
  constructor(props){
    super(props);
  }

  navigateBack(event) {
    event.preventDefault();
    History.goBack();
  }

  render(){
    return (
      <div className="ibox-title">
        <div className="row">
          <div className="col-md-6 col-xs-6 col-sm-12">
            <h3>{this.props.title}</h3>
          </div>
          <div className="col-md-6 col-xs-6 col-sm-12 text-right">
            <a onClick={this.navigateBack.bind(this)} className="btn btn-sm btn-white" href="#">
              <i className="fa fa-angle-left m-r-sm"></i>Go Back
            </a>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

class AddEntity extends React.Component {
  constructor (props) {
    super(props);
    this.state = AddEntityStore.getState().model;
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    AddEntityStore.listen(this.onChange);
  }

  componentWillUnmount() {
    AddEntityStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state.model);
  }

  getValue(model,fieldName){
    var parts = fieldName.split('_');
    if(parts.length>1){
      for(var index=0;index<parts.length-1;index++){
        model = model[parts[index]];
      }
      var lastPart = parts[parts.length-1];
      return model[lastPart];
    }
    else{
      return model[parts[0]];
    }
  }

  tryUpdateModel(){
    this.state.idnumber = $('#idnumber').val();
    this.state.name = $('#name').val();
    this.state.dba = $('#dba').val();
    this.state.individual = $('#individual').val();
    this.state.data.phone = $('#data_phone').val();
    this.state.data.email = $('#data_email').val();
    this.state.data.password = $('#data_password').val();
    this.state.data.website = $('#data_website').val();
  }

  save(event){
    event.preventDefault();
    this.tryUpdateModel();
    if(Validator.isValid('people',this.state,true)){      
      AddEntityActions.save(this.state,((err,data)=>{
        if(!err){
          this.refs.Alert.success('Entity created successfully.');
          setTimeout(function(){
            History.goBack();
          },700);
        }
        else{
          this.refs.Alert.error(err.message);
        }
      }));
    }
  }

  clear (){
    var model = AddEntityStore.getState().model;
    model.data.email = null;
    model.data.password = null;
    model.data.phone = null;
    model.data.website = null;
    model.dba = null;
    model.idnumber = null;
    model.name = null;
    this.setState({model});
    {/* setState is not updating view. I am facing issue here. Once it is resolved, I will remove the below lings */}
    $('#idnumber').val('');
    $('#name').val('');
    $('#dba').val('');
    $('#individual').val('');
    $('#data_phone').val('');
    $('#data_email').val('');
    $('#data_password').val('');
    $('#data_website').val('');
  }

  render () {
      return (
        <Panel>
          <PanelTitle title="New Entity" />
          <PanelBody>
            <Alert ref="Alert"/>
            <div className="row">
              <div className="col-xs-12">
                  <form className="form-horizontal" method="post">
                      <div className="form-group">
                          <label className="col-lg-3 control-label">ID Number</label>
                          <div className="col-lg-4">
                              <input value={this.state.idnumber} type="text" id="idnumber" className="form-control" />
                              <span id="idnumber_error" className="text-danger"></span>
                          </div>
                      </div>
                      <div className="form-group">
                          <label className="col-lg-3 control-label">Name</label>
                          <div className="col-lg-4">
                              <input value={this.state.name} type="text" id="name" className="form-control" />
                              <span id="name_error" className="text-danger"></span>
                          </div>
                      </div>
                      <div className="form-group">
                          <label className="col-lg-3 control-label">Type</label>
                          <div className="col-lg-4">
                            <select value={this.state.individual} id="individual" className="form-control">
                              <option value="false">Company</option>
                              <option value="true">Individual</option>
                            </select> 
                            <span id="individual_error" className="text-danger"></span>
                          </div>
                      </div>
                      <div className="form-group">
                          <label className="col-lg-3 control-label">Doing Business As</label>
                          <div className="col-lg-4">
                              <input type="text" value={this.state.dba} id="dba" className="form-control" />
                              <span id="dba_error" className="text-danger"></span>
                          </div>
                      </div>
                      <div className="form-group">
                          <label className="col-lg-3 control-label">Phone No</label>
                          <div className="col-lg-4">
                              <input type="text" value={this.state.data.phone} id="data_phone" className="form-control" />
                              <span id="data_phone_error" className="text-danger"></span>
                          </div>
                      </div>
                      <div className="form-group">
                          <label className="col-lg-3 control-label">Email</label>
                          <div className="col-lg-4">
                              <input type="text" value={this.state.data.email} id="data_email" className="form-control" />
                              <span id="data_email_error" className="text-danger"></span>
                          </div>
                      </div>
                      <div className="form-group">
                          <label className="col-lg-3 control-label">Password</label>
                          <div className="col-lg-4">
                              <input type="password" value={this.state.data.password} id="data_password" className="form-control" />
                              <span id="data_password_error" className="text-danger"></span>
                          </div>
                      </div>
                      <div className="form-group">
                          <label className="col-lg-3 control-label">Website</label>
                          <div className="col-lg-4">
                              <input type="text" value={this.state.data.website} id="data_website" className="form-control" />
                              <span id="data_website_error" className="text-danger"></span>
                          </div>
                      </div>
                      <div className="form-group">
                          <div className="col-lg-offset-3 col-lg-4">
                              <button onClick={this.save.bind(this)} type="submit" className="btn btn-sm btn-primary m-r-xs">Save</button>
                              <button onClick={this.clear.bind(this)} type="button" className="btn btn-sm btn-white">Clear</button>
                          </div>
                      </div>
                  </form>
              </div>
            </div>
          </PanelBody>
        </Panel>
      );
  }
}

export default AddEntity;