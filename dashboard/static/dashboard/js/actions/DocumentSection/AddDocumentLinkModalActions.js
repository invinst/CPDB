var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var AddDocumentLinkModalActions = {
  show: function (document) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SHOW_ADD_DOCUMENT_LINK_MODAL,
      document: document
    });
  },

  hide: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.HIDE_ADD_DOCUMENT_LINK_MODAL
    });
  },

  formDataChange: function (stateName, stateValue) {
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_LINK_MODAL_FORM_DATA_CHANGED,
      stateName: stateName,
      stateValue: stateValue
    });
  },

  preSubmit: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.SUBMITTING_DOCUMENT_LINK
    });
  },

  documentLinkAdded: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_LINK_ADDED
    });
  },

  failedToAddDocumentLink: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.FAILED_ADD_DOCUMENT_LINK
    });
  }
};

module.exports = AddDocumentLinkModalActions;
