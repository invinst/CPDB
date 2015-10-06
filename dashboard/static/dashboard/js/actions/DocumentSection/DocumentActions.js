var toastr = require('toastr');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');


var DocumentActions = {
  receivedDocument: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_DOCUMENT,
      data: data
    });
  },

  receivedDocumentByCrid: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_DOCUMENT_CRID,
      data: data
    });
  },

  requestCancel: function (allegation) {
    toastr.success(allegation.crid + " document requests have been canceled.");
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_REQUEST_CANCEL,
      data: allegation
    });
  }
};

module.exports = DocumentActions;
