var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var DocumentActions = {
  receivedDocument: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_DOCUMENT,
      data: data
    });
  },

  requestCancel: function (allegation) {
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_REQUEST_CANCEL,
      data: allegation
    });
  }
};

module.exports = DocumentActions;
