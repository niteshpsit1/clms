/**
  * Grid Class
  *
  * Rendering table body
  *
  * Author     : Aruljothi Parthiban
  * Created At : 21/12/2015
 **/

import React from 'react';

class TableContent extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    if(this.props.Grid.isProcessing){
      return (
        <tbody>
          <tr>
            <td className="text-center" colSpan={this.props.Grid.columns.length}>
              Loading ...
            </td>
          </tr>
        </tbody>
      );
    }
    else{
      if(this.props.Grid.state.Items.length===0){
        return (
          <tbody>
            <tr>
              <td className="text-center" colSpan={this.props.Grid.columns.length}>No record found!</td>
            </tr>
          </tbody>
        );
      }
      else{
        return (
          <tbody>{this.props.children}</tbody>
        );
      }
    }
  }
}

export default TableContent;