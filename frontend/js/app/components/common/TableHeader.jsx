/**
  * Table Header Class
  *
  * A base class for displaying table header with titles
  *
  * Author     : Aruljothi Parthiban
  * Created At : 21/12/2015
 **/

import React from 'react';

class TableHeader extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <thead>
        <tr>
          {
            this.props.columns.map(function(p,index){
              return (
                <th key={p.Id}>{p.Name}</th>
              );
            },this)
          }
        </tr>
      </thead>
    );
  }
}

export default TableHeader;