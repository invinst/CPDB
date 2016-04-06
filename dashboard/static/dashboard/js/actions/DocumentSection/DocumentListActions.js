var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var toastr = require('toastr');

var DocumentListActions = {
  receivedDocumentList: function (data, nextPage) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_DOCUMENT_LIST,
      data: data,
      next: nextPage
    });
  },

  receivedMore: function (data, nextPage) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_MORE_DOCUMENT_RESULTS_DATA,
      data: data,
      next: nextPage
    });
  },

  lockScroll: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.LOCK_SCROLL_DOCUMENT_LIST
    });
  },

  setActive: function (document) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_ALLEGATION,
      data: document
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
