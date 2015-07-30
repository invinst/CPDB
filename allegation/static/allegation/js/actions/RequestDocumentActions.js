var AppDispatcher = require('../dispatcher/AppDispatcher');
var RequestDocumentConstants = require('../constants/RequestDocumentConstants');

var RequestDocumentActions = {
  request: function(value) {
    AppDispatcher.dispatch({
      actionType: RequestDocumentConstants.REQUEST_DOCUMENT,
      value: value
    });
  },

  registerEmail: function (crid, email) {
    $.ajax({
        url: '/document/request/',
        type: 'POST',
        dataType: 'JSON',
        data: {
          crid: crid,
          email: email,
          session: SESSION_HASH // defined in CPDBApp.react
        },
        success: function () {
          RequestDocumentActions.setRequested(allegation.crid);
        },
        error: function(xhr) {
          for (var key in xhr.responseJSON) {
            var errors = xhr.responseJSON[key];
            for (var i = 0; i < errors.length; i++) {
              toastr.error(errors[i]);
            }
          }
        }
      });
  },

  setRequested: function(value) {
    AppDispatcher.dispatch({
      actionType: RequestDocumentConstants.DOCUMENT_REQUESTED,
      value: value
    });
  }
};
module.exports = RequestDocumentActions;
