var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var DocumentRequestAPI = require('../../utils/DocumentRequestAPI');

var DocumentListActions = {
  receivedDocumentList: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_DOCUMENT_LIST,
      data: data
    });
  }
};

module.exports = DocumentListActions;
