var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var ComplaintPageServerActions = {
  received: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.COMPLAINT_PAGE_RECEIVED_DATA
    });
  },

  failedToReceive: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.COMPLAINT_PAGE_FAILED_TO_RECEIVED_DATA
    });
  },
};

module.exports = ComplaintPageServerActions;
