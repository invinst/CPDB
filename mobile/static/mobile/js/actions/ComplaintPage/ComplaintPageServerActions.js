var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var ComplaintPageServerActions = {
  received: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.COMPLAINT_PAGE_RECEIVED_DATA,
      data: data
    });
  },

  failedToReceive: function (crid) {
    AppDispatcher.dispatch({
      actionType: AppConstants.COMPLAINT_PAGE_FAILED_TO_RECEIVED_DATA,
      data: crid
    });
  },
};

module.exports = ComplaintPageServerActions;
