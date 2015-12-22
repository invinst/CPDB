var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var OfficerPageServerActions = {
  received: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.OFFICER_PAGE_RECEIVED_DATA,
      data: data
    });
  },

  failedToReceive: function (pk) {
    AppDispatcher.dispatch({
      actionType: AppConstants.OFFICER_PAGE_FAILED_TO_RECEIVED_DATA,
      data: pk
    });
  },
};

module.exports = OfficerPageServerActions;
