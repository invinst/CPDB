var RequestDocumentDispatcher = require('../dispatcher/RequestDocumentDispatcher');
var RequestDocumentConstants = require('../constants/RequestDocumentConstants');

var RequestDocumentActions = {
  request: function(value) {
    RequestDocumentDispatcher.dispatch({
      actionType: RequestDocumentConstants.REQUEST_DOCUMENT,
      value: value
    });
  },
  setRequested: function(value) {
    RequestDocumentDispatcher.dispatch({
      actionType: RequestDocumentConstants.DOCUMENT_REQUESTED,
      value: value
    });
  }
};
module.exports = RequestDocumentActions;
