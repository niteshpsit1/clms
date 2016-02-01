/**
 * Loans table: React Class
 *
 * Lists all Search Results
 *
 * @author: Nitesh Jatav
 * @created: 14/1/2016
 **/

import React from "react";
import LoanStore from "../stores/LoanStore";
import EntityStore from "../stores/EntityStore";
import SearchStore from "../stores/SearchStore";
import ServerActionCreator from "../actions/ServerActionCreator";
import History from "../utils/History";

let SearchResult = React.createClass({

    getInitialState: function() {
        return {
           searchtext:'',
           searchList: '',
           item:[],
           loansList: LoanStore.getAll()
        }
    },

    _onChange: function() {
        var list = LoanStore.getAll();
        if (list != null) {
           this.setState({loansList: LoanStore.getAll()});
        }
    },


    componentWillReceiveProps: function(nextProps) {
   
    },

    getQueryStringValue: function (key) {  
        return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
    },

    componentDidMount: function() {
        document.getElementById("top-search").value = this.getQueryStringValue("top-search");
        this.setState({searchtext: this.getQueryStringValue("top-search")});

        $.ajax({
          type: 'GET',
          url: frontendSettings.endpoints.search,
          data: {
            name:this.getQueryStringValue("top-search")
          },
          dataType: 'json',

          beforeSend: function(xhr) {
            xhr.setRequestHeader('x-access-token', JSON.parse(sessionStorage.getItem('user')).token);
          },
          success:  this.onDataReceived,

          error: function(result) {
            console.log("error:");
            console.log(result);
            if (result.status === 403) {
              window.location.replace("/login.html");
            }
          }

        });
    LoanStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    LoanStore.removeChangeListener(this._onChange);
  },

  onDataReceived : function(data){
    var collection = data.result;
    this.setState({
      item: collection
    });
  },

  rowClick: function(i) {
    History.pushState(null, '/entities/' + this.state.item[i].id);
  },

  rowClickLoan: function(i) {
    History.pushState(null, '/loans/' + this.state.loansList[i].id);
  },

  render: function() {
    var self = this;
    var user = [];
    if(this.state.item.length > 0) {
      return (
        <div>
        <table id="entities-table" className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Search Results:</th>
                </tr>
                <tr>
                    <th>Name</th>
                    <th>DBA</th>
                </tr>
            </thead>
            <tbody>
                {this.state.item.map((item, i) => {
                    user[i] = item;
                    return (
                        <tr key={item.name + " " + item.id} onClick={this.rowClick.bind(this, i)}>
                            <td>{item.name}</td>
                            <td>{item.dba}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>

        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Principal</th>
                    <th>Entity</th>
                    <th>Loan Term</th>
                    <th>Interest</th>
                </tr>
            </thead>

            <tbody>

                {user.map(function(parent,i) {

                    return self.state.loansList.map(function(item,i) {
                        if(item.LoanEntity.length !== 0){
                            if(item.LoanEntity[0].entity_id==parent.id) {
                                return (
                                    <tr key={item.id} onClick={self.rowClickLoan.bind(self, i)} >
                                        <td>{item.principal}</td>
                                        <td>{parent.name}</td>
                                        <td>{item.loanterm}</td>
                                        <td>{item.interestrate}</td>
                                    </tr>
                                );
                            } 
                        }
                    })}
                )}
            </tbody>
        </table>    
    </div>
      );
    } else {
        return (
            <div>No result found</div>);
    }
  }
});

export default SearchResult;