/**
  * Alert Class
  *
  * A base class for displaying bootstrap alerts
  *
  *
  * Author     : Aruljothi Parthiban
  * Created At : 25/12/2015
 **/

import React from 'react';


class Alert extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      message : null,
      type : null
    };
  }

  getCssClass(){
    var className = 'alert alert-';
    if(this.state.type==='error'){
      className+='danger';
    }
    else{
      className+=this.state.type;
    }
    return className;
  }

  success(message){
    this.setState({
      message : message,
      type : 'success'
    });
  }

  error(message){
    this.setState({
      message : message,
      type : 'error'
    });
  }

  warning(message){
    this.setState({
      message : message,
      type : 'warning'
    });
  }

  info(message){
    this.setState({
      message : message,
      type : 'info'
    });
  }

  clear(){
    this.setState({
      message : null,
      type : null
    });
  }

  getType(){
    var capitalize = this.state.type;
    return capitalize.charAt(0).toUpperCase() + capitalize.slice(1);
  }

  render(){

    if(this.state.message){
      return (
        <div className={this.getCssClass()}>
          <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
          <strong>{this.getType()} !</strong>{this.state.message}
        </div>
      );
    }
    return null;
  }
}

 export default Alert;