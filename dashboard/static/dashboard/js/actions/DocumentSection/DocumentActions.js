var toastr = require('toastr');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var DocumentCloudAPI = require('utils/DocumentCloudAPI');


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
    toastr.success(allegation.crid + ' document requests have been canceled.');
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_REQUEST_CANCEL,
      data: allegation
    });
  },

  requestPutToPending: function (allegation) {
    toastr.success(allegation.crid + ' document has been requested.');
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_PUT_TO_PENDING,
      data: allegation
    });
  },

  requestPendingCancelled: function (allegation) {
    toastr.success(allegation.crid + ' document pending has been cancelled.');
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_PUT_TO_REQUESTING,
      data: allegation
    });
  },

  uploadDocument: function (data) {
    return DocumentCloudAPI.uploadDocument(data);
  }
};

module.exports = DocumentActions;
