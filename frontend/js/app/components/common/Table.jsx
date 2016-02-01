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
import TableHeader from './TableHeader';
import TableContent from './TableContent';
import FooterSummary from './FooterSummary';
import TableFooter from './TableFooter';
import _ from 'lodash';

class Table extends React.Component{
  constructor(props){
    super(props);
    this.columns = [];
  }
  setColumns(columns){
    var columnPrefix = '__col_';
    var index = 1;
    _.forEach(columns,function(p){
      this.columns.push({
        Id : columnPrefix+index,
        Name : p
      })
    },this);
  }

  render(){

    return (
      <div className="clear">
        <div className="table-responsive">
          <table className="table table-bordered">
            <TableHeader columns={this.props.columns}/>
            <TableContent Grid={this.props.Grid}>
              {this.props.children}
            </TableContent>
          </table>
        </div>
        <TableFooter Grid={this.props.Grid} value={this.props.Result} />
      </div>
    );
  }
}

export default Table;