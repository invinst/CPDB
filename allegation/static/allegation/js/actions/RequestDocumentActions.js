var AppDispatcher = require('../dispatcher/AppDispatcher');
var RequestDocumentConstants = require('../constants/RequestDocumentConstants');

var RequestDocumentActions = {
  request: function(value) {
    AppDispatcher.dispatch({
      actionType: RequestDocumentConstants.REQUEST_DOCUMENT,
      value: value
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
