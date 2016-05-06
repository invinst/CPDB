var AppDispatcher = require('../dispatcher/AppDispatcher');
var SessionStore = require('stores/SessionStore');
var RequestDocumentConstants = require('../constants/RequestDocumentConstants');

var RequestDocumentActions = {
  request: function (document) {
    AppDispatcher.dispatch({
      actionType: RequestDocumentConstants.REQUEST_DOCUMENT,
      document: document
    });
  },

  registerEmail: function (documentId, email) {
    $.ajax({
      url: '/document/request/',
      type: 'POST',
      dataType: 'JSON',
      data: {
        'document_id': documentId,
        'email': email,
        'session': SessionStore.getHash() // defined in CPDBApp.react
      },
      success: function () {
        RequestDocumentActions.setRequested(documentId);
      },
      error: function (xhr) {
        RequestDocumentActions.requestFailed(xhr.responseJSON.errors);
      }
    });
  },

  setRequested: function (documentId) {
    AppDispatcher.dispatch({
      actionType: RequestDocumentConstants.DOCUMENT_REQUESTED,
      id: documentId
    });
  },

  requestFailed: function (errors) {
    AppDispatcher.dispatch({
      actionType: RequestDocumentConstants.DOCUMENT_REQUEST_FAILED,
      errors: errors
    });
  }
};
module.exports = RequestDocumentActions;
