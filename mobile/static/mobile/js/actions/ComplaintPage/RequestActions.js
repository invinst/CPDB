var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var RequestActions = {
  requestSuccess: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_REQUEST_SUCCESS
    });
  },

  requestFail: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_REQUEST_FAIL
    });
  }
};

module.exports = RequestActions;
