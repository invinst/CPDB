var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var InterfaceTextActions = {
  getInterfaceTextsSucessfully: function (results) {
    AppDispatcher.dispatch({
      actionType: AppConstants.GET_INTERFACE_TEXT_SUCCESS,
      interfaceTexts: results
    });
  },

  failedToGetInterfaceTexts: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.GET_INTERFACE_TEXT_FAILED
    });
  }
};

module.exports = InterfaceTextActions;
