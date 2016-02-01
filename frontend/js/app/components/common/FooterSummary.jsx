/**
  * Footer Summary Class
  *
  * Displays the footer summary
  *
  * Author     : Aruljothi Parthiban
  * Created At : 21/12/2015
 **/

import React from 'react';

class FooterSummary extends React.Component{
  constructor(props){
    super(props);
  }

  render(){

    if(this.props.count===1){
      return(
        <small className="text-muted inline">
          <span>Showing 1 item</span>
        </small>
      );
    }
    else if(this.props.count>1){
      return(
        <small className="text-muted inline">
          <span>Showing {this.props.startIndex} - {this.props.endIndex} of {this.props.count} items</span>
        </small>
      );
    }
    return (
      <small className="text-muted inline"></small>
    );
  }
}

export default FooterSummary;