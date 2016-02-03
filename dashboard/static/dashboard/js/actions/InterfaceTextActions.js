var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var InterfaceTextActions = {
  receivedData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_INTERFACE_TEXTS,
      data: data
    });
  },

  update: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.UPDATE_INTERFACE_TEXTS,
      data: data
    });
  }
};

module.exports = InterfaceTextActions;
