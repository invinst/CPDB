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

  requestCancel: function (document) {
    toastr.success(document.allegation + ' document requests have been canceled.');
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_REQUEST_CANCEL,
      data: document
    });
  },

  requestPutToPending: function (document) {
    toastr.success(document.allegation + ' document has been requested.');
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_PUT_TO_PENDING,
      data: document
    });
  },

  requestPendingCancelled: function (document) {
    toastr.success(document.allegation + ' document pending has been cancelled.');
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_PUT_TO_REQUESTING,
      data: document
    });
  }
};

module.exports = DocumentActions;
