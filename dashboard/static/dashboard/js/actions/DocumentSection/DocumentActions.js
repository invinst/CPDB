var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var DocumentActions = {
  receivedDocument: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_DOCUMENT,
      data: data
    });
  }
};

module.exports = DocumentActions;
