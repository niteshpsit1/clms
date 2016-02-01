import alt from '../alt';
import moment from 'moment';
import _ from 'lodash';
import ApiUtils from '../utils/ApiUtils';

class GridActions {
  	constructor() {
    	this.generateActions(
      	'getDataSuccess',
      	'getDataFail'
    	);
    	this.RecordType = null;
      this.Events = [];
    	this._data = null;
    	this._params = {};
  	}

    setRecordType(type){    
      this.RecordType = type;
      return this;
    }

  	toQueryString(params){
  		var url = this.BaseUrl;
  		_.forEach(params,function(value,key){
  			url+=key;
  			url+='=';
  			url+=value;
  			url+='&';
  		});
  		url = url.substr(0,url.length-1);
  		return url;
  	}

  	getPaginationResult(result){
  		var startIndex = (this._params.PageIndex - 1) * this._params.PageSize;
  		var endIndex = startIndex + this._params.PageSize;

  		if(endIndex>result.length){
  			endIndex = result.length;
  		}
  		var items = [];
  		for(var index = startIndex;index< endIndex;index++){
  			items.push(result[index]);
  		}
  		var data = {
	    	PageIndex : this._params.PageIndex,
	    	PageSize : this._params.PageSize,
	    	Items : items,
	    	Count : result.length
	    };
	    return data;
  	}

    applyFilter(){
      var data = this._data.result;
      if(this.Events.length>0){
        var predicate = _.find(this.Events,function(e){
          return e.event ==='filtering';
        });
        if(predicate){
          data = predicate.callback(this._params,data);
        }
      }
      return data;
    }

  clearCache(){
    this._data = null;
  }
	getData(params){
		this._params = params;
		if(this._data===null){
			ApiUtils.getRecords(this.RecordType,(err,data)=>{
        if(err){
          this.getDataFail(jqXhr);
        }
        else{
          this._data = data;
          this.getDataSuccess(this.getPaginationResult(this.applyFilter()));
        }
      });
    }
    else{
    	this.getDataSuccess(this.getPaginationResult(this.applyFilter()));
    }
	}
}

export default alt.createActions(GridActions);