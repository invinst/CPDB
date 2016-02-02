var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var SessionsActions = {
  receivedData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_SESSIONS_ALIAS_DATA,
      data: data
    });
  },

  receivedMore: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_MORE_SESSIONS_ALIAS_DATA,
      data: data
    });
  },

  lockScroll: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.LOCK_SESSION_ALIAS_PAGE_SCROLL
    });
  },

  searchFor: function (query) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SEARCH_FOR_SESSION_ALIAS,
      data: query
    });
  },

  deletedAlias: function (alias) {
    AppDispatcher.dispatch({
      actionType: AppConstants.DELETED_SESSION_ALIAS,
      data: alias
    });
  }
};

module.exports = SessionsActions;
