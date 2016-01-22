var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var ComplaintListAPI = require('../../utils/ComplaintListAPI');

var OutcomeFilterActions = {
  setActiveFilter: function (val, callAPI) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER,
      filter: val
    });

    if (callAPI){
    	ComplaintListAPI.getData(true);
    }
  }
};

module.exports = OutcomeFilterActions;
