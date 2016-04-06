var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var TabsActions = {
  setActiveStatus: function (tab) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_DOCUMENT_ACTIVE_TAB,
      data: tab
    });
  },

  setActiveDocumentType: function (type) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_DOCUMENT_TYPE_TAB,
      data: type
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
