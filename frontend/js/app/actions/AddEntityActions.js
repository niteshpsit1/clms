import alt from '../alt';
import moment from 'moment';
import _ from 'lodash';
import ApiUtils from '../utils/ApiUtils';

class AddEntityActions {
  	constructor() {
    	this.generateActions('saveSuccess','saveFail');
    	this.BaseUrl = frontendSettings.endpoints.entities;
  	}

	save(model,callback){
		ApiUtils.saveEntity(model,(err,data)=>{
			if(err){
				callback(err,null);
				this.saveFail(err);
			}
			else{
				if(data.error){
					callback(data,null);
					this.saveFail(err);
				}
				else{
					callback(null,data);
					this.saveSuccess(data);
				}
			}
		});
	}
}

export default alt.createActions(AddEntityActions);