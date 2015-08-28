var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var ComplaintListAPI = require('../../utils/ComplaintListAPI');

var OutcomeFilterActions = {
  setActiveFilter: function (val) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER,
      filter: val
    });

    ComplaintListAPI.getData();
  }
};

module.exports = OutcomeFilterActions;
