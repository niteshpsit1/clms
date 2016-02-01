/**
  * Grid Class
  *
  * A base class for displaying records with following features
  *
  * -----------------------------
  * Features 
  * -----------------------------
  *   i) Pagination
  *  ii) Search all fields
  * iii) Delete multiple records
  *
  * Author     : Aruljothi Parthiban
  * Created At : 21/12/2015
 **/

import React from 'react';
import _ from 'lodash';
import GridActions from '../../actions/GridActions';
import GridStore from '../../stores/GridStore';


class Grid extends React.Component{
  constructor(props){
    super(props);
    this.state = GridStore.getState().result;
    this.onChange = this.onChange.bind(this);
    this.columns = [];
    this.params = {};
    // progress indicator 
    this.isProcessing = false;
    GridActions.clearCache();
  }

  componentDidMount() {
    GridStore.listen(this.onChange);
    this.load();
  }

  componentWillUnmount() {
    GridStore.unlisten(this.onChange);
  }

  load(){
    this.isProcessing = true;
    GridActions.getData(this.getParams());
  }

  onChange(state) {
    this.isProcessing = false;
    this.setState(state.result);
  }

  setRecordType(type){
    GridActions.setRecordType(type);
    return this;
  }

  on(event,predicate){
    GridActions.Events.push({
      event:event,
      callback:predicate
    });
  }

  setColumns(columns){
    var columnPrefix = '__col_';
    var index = 1;
    var _this = this;
    _.forEach(columns,function(p){
      _this.columns.push({
        Id : columnPrefix+index,
        Name : p
      });
      index++;
    });
  }

  pageSizeChange(event){
    this.moveToFirstPage();
    this.state.PageSize = parseInt(event.target.value);
    this.load();
  }

  addParam(key,value){
    this.params[key] = value;
  }
  removeParam(key){
    if(this.params.hasOwnProperty(key)){
      delete this.params[key];
    }
  }
  clearParams(){
    this.moveToFirstPage();
    this.params = {};
  }
  moveToFirstPage(){
    this.state.PageIndex =1;
  }
  getParams(){
    var parameters = {
      PageIndex : this.state.PageIndex,
      PageSize : this.state.PageSize
    };
    _.forEach(this.params,function(value,key){
      parameters[key] = value;
    });
    return parameters;
  }
}

export default Grid;