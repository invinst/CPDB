var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var SessionsActions = {
  receivedData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_SESSIONS_DATA,
      data: data
    });
  },

  receivedMore: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_MORE_SESSIONS_DATA,
      data: data
    });
  },

  lockScroll: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.LOCK_SESSION_PAGE_SCROLL,
    });
  },

  searchFor: function(query) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SEARCH_FOR_SESSION,
      data: query
    });
  }
};

module.exports = SessionsActions;
