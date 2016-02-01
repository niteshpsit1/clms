import alt from '../alt';
import AddEntityActions from '../actions/AddEntityActions';

class AddEntityStore {
  constructor() {
    this.bindActions(AddEntityActions);

    this.model = {
      idnumber : null,
      name : null,
      individual : true,
      dba : null,
      data : {
        phone :null,
        email : null,
        password : null,
        website : null
      }
    };
  }

  onSaveSuccess(data) {
    this.model = data;
  }

  onSaveFail(jqXhr) {
    console.log('AddEntity Store Error',jqXhr);
  }
}

export default alt.createStore(AddEntityStore);