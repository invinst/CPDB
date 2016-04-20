var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var RequestActions = {
  registerEmail: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_REQUESTED
    });
  }
};

module.exports = RequestActions;
