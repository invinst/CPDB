var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var AddDocumentLinkModalActions = {
  show: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SHOW_ADD_DOCUMENT_LINK_MODAL,
      data: data
    });
  },

  hide: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.HIDE_ADD_DOCUMENT_LINK_MODAL
    });
  },


  formDataChange: function(stateName, stateValue) {
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_LINK_MODAL_FORM_DATA_CHANGED,
      stateName: stateName,
      stateValue: stateValue
    });
  },

  documentLinkAdded(crid) {
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_LINK_ADDED,
      crid: crid
    });
  },

  failedToAddDocumentLink() {
    AppDispatcher.dispatch({
      actionType: AppConstants.FAILED_ADD_DOCUMENT_LINK,
    });
  }
};

module.exports = AddDocumentLinkModalActions;
