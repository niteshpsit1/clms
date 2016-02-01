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

class PanelBody extends React.Component{
  constructor(props){
    super(props);
  }

  render(){

    return (
      <div className="ibox-content">
        {this.props.children}
      </div>
    );
  }
}

export default PanelBody;