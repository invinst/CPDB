var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var OfficerPageServerActions = {
  received: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.OFFICER_PAGE_RECEIVED_DATA,
      data: data
    });
  },

  failedToReceive: function (id) {
    AppDispatcher.dispatch({
      actionType: AppConstants.OFFICER_PAGE_FAILED_TO_RECEIVED_DATA,
      data: id
    });
  },
};

module.exports = OfficerPageServerActions;
