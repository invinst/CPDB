var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var MainPageServerActions = {
  received: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MAIN_PAGE_RECEIVED_DATA,
      data: data
    });
  },

  failedToReceive: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.MAIN_PAGE_FAILED_TO_RECEIVED_DATA
    });
  }
};

module.exports = MainPageServerActions;
