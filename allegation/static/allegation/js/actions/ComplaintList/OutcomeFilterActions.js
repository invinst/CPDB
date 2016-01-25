var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var ComplaintListAPI = require('../../utils/ComplaintListAPI');

var OutcomeFilterActions = {
  setActiveFilter: function (val, callAPI) {
    var actionType = callAPI ?
      AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER :
      AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER_SUB_PAGE;

    AppDispatcher.dispatch({
      actionType: actionType,
      filter: val
    });

    if (callAPI){
      ComplaintListAPI.getData(true);
    }
  }
};

module.exports = OutcomeFilterActions;
