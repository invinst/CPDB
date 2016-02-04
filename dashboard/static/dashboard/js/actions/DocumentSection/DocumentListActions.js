var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var toastr = require('toastr');

var DocumentListActions = {
  receivedDocumentList: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_DOCUMENT_LIST,
      data: data
    });
  },

  receivedMore: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_MORE_DOCUMENT_RESULTS_DATA,
      data: data
    });
  },

  lockScroll: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.LOCK_SCROLL_DOCUMENT_LIST
    });
  },

  setActive: function (allegation) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_ALLEGATION,
      data: allegation
    });
  },

  requestNotFound: function () {
    toastr.error('CRID not found');
  },

  sortBy: function (sortBy) {
    AppDispatcher.dispatch({
      actionType: AppConstants.DOCUMENT_SORT_LIST,
      data: sortBy
    });
  }
};

module.exports = DocumentListActions;
