import alt from '../alt';
import GridActions from '../actions/GridActions';

class GridStore {
  constructor() {
    this.bindActions(GridActions);

    this.result = {
      PageIndex : 1,
      PageSize : 10,
      Count : 0,
      Items : []
    };
  }

  onGetDataSuccess(data) {
    this.result = data;
  }

  onGetDataFail(jqXhr) {
    console.log(jqXhr);
  }
}

export default alt.createStore(GridStore);