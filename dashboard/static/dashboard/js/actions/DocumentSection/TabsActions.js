var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var TabsActions = {
  setActive: function (tab) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_DOCUMENT_ACTIVE_TAB,
      data: tab
    });
  },

  receivedDocumentRequestAnalysis: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_DOCUMENT_REQUEST_ANALYSIS,
      data: data
    });
  }
};

module.exports = TabsActions;
