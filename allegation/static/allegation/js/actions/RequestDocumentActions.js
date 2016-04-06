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
        var key, errors, i;

        for (key in xhr.responseJSON) {
          errors = xhr.responseJSON[key];
          for (i = 0; i < errors.length; i++) {
            toastr.error(errors[i]);
          }
        }
      }
    });
  },

  setRequested: function (documentId) {
    AppDispatcher.dispatch({
      actionType: RequestDocumentConstants.DOCUMENT_REQUESTED,
      id: documentId
    });
  }
};
module.exports = RequestDocumentActions;
