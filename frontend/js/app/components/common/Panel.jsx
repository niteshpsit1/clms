/**
  * Panel Class
  *
  * A React class to render panel
  *
  * Author     : Aruljothi Parthiban
  * Created At : 22/12/2015
 **/

import React from 'react';

class Panel extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="wrapper wrapper-content">
        <div className="row">
          <div className="animated">
            <div className="mail-box">
              <div className="ibox custom-ibox">
                {this.props.children}
              </div>  
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Panel;