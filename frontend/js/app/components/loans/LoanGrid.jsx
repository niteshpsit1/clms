/**
  * LoanGrid Class
  *
  * A derived class to display entities
  *
  * Author     : Aruljothi Parthiban
  * Created At : 21/1/2016
 **/

import React from 'react';
import Moment from 'moment';
import _ from 'lodash';
import Grid from '../common/Grid';
import Panel from '../common/Panel';
import PanelBody from '../common/PanelBody';
import Table from '../common/Table';
import History from "../../utils/History";

class PanelTitle extends React.Component{
  constructor(props){
    super(props);
  }

  navigateToAddLoan(event) {
    event.preventDefault();
    History.pushState({}, "/loans/new");
  }

  render(){
    return (
      <div className="ibox-title">
        <div className="row">
          <div className="col-md-6 col-xs-6 col-sm-12">
            <h3>{this.props.title}</h3>
          </div>
          <div className="col-md-6 col-xs-6 col-sm-12 text-right">
            <a onClick={this.navigateToAddLoan.bind(this)} href="#" className="btn btn-sm btn-danger">
              <i className="fa fa-plus m-r-sm"></i>
              Add New
            </a>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

class PanelToolBox extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="mail-tools tooltip-demo m-t-md">
        <div className="row">
          <div className="col-md-offset-8 col-md-4 col-xs-4 col-sm-4 text-right">
            <div className="input-group">
              <input onChange={this.props.onChange} type="text" className="form-control form-control input-sm" placeholder="Search ..." />
              <div className="input-group-btn">
                <button className="btn btn-white btn-sm">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class EntitiesGrid extends Grid {
  constructor (props) {
    super(props);
    this.setRecordType('loan');
    this.setColumns(['Principal','Entity','Loan Term','Interest','Start Date','Pay Cycle','Loan System']);
    this.initQueryParams();
    this.on('filtering',function(params,data){
      if(params.SearchText){
        data = _.filter(data,function(x){
          var condition_one = (x.loanterm && x.loanterm === parseInt(params.SearchText));
          var condition_two = (x.interestrate && x.interestrate ===params.SearchText);
          var condition_three = (x.LoanEntity.length > 0 
            && x.LoanEntity[0] && x.LoanEntity[0].Entity && x.LoanEntity[0].Entity.name.toLowerCase().indexOf(params.SearchText.toLowerCase()) !==-1);
          var condition_four = (x.principal && x.principal === params.SearchText);
          return (condition_one || condition_two || condition_three || condition_four);
        });
      }
      return data;
    });
  }

  initQueryParams (){
    this.queryParams = this.getQueryParams();
    if(this.queryParams.show==='people'){
      this.addParam('individual',true);
    }
    else if(this.queryParams.show==='orgs'){
      this.addParam('individual',false);
    }
  }

  getQueryParams(){
    var search = window.location.search.replace("?", "");
    var args = null;
    if(search){
      args = {};
      var parts = search.split('&');
      _.forEach(parts,function(part){
        var keyValue = part.split('=');
        if(keyValue.length===2){
          args[keyValue[0]] = keyValue[1].toLowerCase();
        }
      });
    }
    if(args===null){
      args = {
        show : 'application'
      };
    }
    return args;
  }

  getTitle(){
    if(this.queryParams.show==='application'){
      return 'Applications';
    }
    else if(this.queryParams.show==='processed'){
      return 'Processed Applications';
    }
    else if(this.queryParams.show==='late'){
      return 'Late Applications';
    }
    else if(this.queryParams.show==='active'){
      return 'Active Applications';
    }
    return null;
  }

  search(event){
    this.clearParams();
    this.initQueryParams();
    this.addParam('SearchText',event.target.value);
    this.load();
  }

  componentWillReceiveProps(nextProps){
    this.initQueryParams();
    this.moveToFirstPage();
    this.load();
  }

  goToEntity (loan) {
    History.pushState(null, '/loans/' + loan.id);
  }

  render () {
      console.log(this.state.Items);
      return (
        <Panel>
          <PanelTitle title={this.getTitle()}>
            <PanelToolBox onChange={this.search.bind(this)} />
          </PanelTitle>
          <PanelBody>
            <Table Result={this.state} Grid={this} columns={this.columns}>
            {
              this.state.Items.map(function(p,index){
                return (
                  <tr key={p.id} onClick={this.goToEntity.bind(this, p)}>
                    <td>{p.principal}</td>
                    <td>{p.LoanEntity[0].Entity.name}</td>
                    <td>{p.loanterm}</td>
                    <td>{p.interestrate}</td>
                    <td>{p.startingdate?Moment(p.startingdate).format("DD-MMM-YYYY h:mm:ss a"):''}</td>
                    <td>Test</td>
                    <td>Test</td>
                  </tr>
                  );
                },this)
              }
            </Table>
          </PanelBody>
        </Panel>
      );
  }
}

export default EntitiesGrid;