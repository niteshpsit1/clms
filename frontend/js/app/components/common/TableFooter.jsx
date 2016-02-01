/**
  * Table Footer Class
  *
  * Render the table footer
  *
  * Author     : Aruljothi Parthiban
  * Created At : 21/12/2015
 **/

import React from 'react';
import FooterSummary from './FooterSummary';

class TableFooter extends React.Component{
  constructor(props){
    super(props);
  }

  prev() {
    this.props.value.PageIndex--;
    this.props.Grid.load();
  }

  next() {
    this.props.value.PageIndex++;
    this.props.Grid.load();
  }

  getStartIndex(){
    return ((this.props.value.PageIndex - 1) * this.props.value.PageSize) + 1;
  }

  getEndIndex (){
    var index = (this.props.value.PageIndex * this.props.value.PageSize);
    if (index < this.props.value.Count) {
      return index;
    }
    return this.props.value.Count;
  }

  pageSizeChange(event){
    this.props.Grid.moveToFirstPage();
    this.props.value.PageSize = parseInt(event.target.value);
    this.props.Grid.load();
  }

  load (){
    this.props.Grid.moveToFirstPage();
    this.props.Grid.load();
  }

  disablePrev (){
    return (this.props.value.Items.length === this.props.value.Count || this.props.value.PageIndex===1);
  }

  disableNext(){
    return (this.getEndIndex() === this.props.value.Count);
  }

  render(){

    return(
      <div className="row m-t-sm custom-footer">
        <div className="col-md-4 col-xs-4 col-sm-4">
          <select onChange={this.pageSizeChange.bind(this)} value={this.props.value.PageSize} className="input-sm form-control">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div className="col-md-4 col-xs-4 col-sm-4 text-center">
            <FooterSummary count={this.props.value.Count} startIndex={this.getStartIndex()} endIndex={this.getEndIndex()} />
        </div>
        <div className="col-md-4 col-xs-4 col-sm-4 text-right">
          <div className="btn-group m-r-xs">
            <button onClick={this.load.bind(this)} className="btn btn-xs btn-bg btn-white">
              <i className="fa fa-refresh"></i>
            </button>
          </div>
          <div className="btn-group">
            <button disabled={this.disablePrev()} onClick={this.prev.bind(this)} className="btn btn-xs btn-bg btn-white">
              <i className="fa fa-chevron-left"></i>
            </button>
            <button disabled={this.disableNext()} onClick={this.next.bind(this)} className="btn btn-xs btn-bg btn-white">
              <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default TableFooter;