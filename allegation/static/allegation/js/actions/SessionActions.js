var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');

var SessionActions = {
  receivedSessionInfoData: function(data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_SESSION_DATA,
      data: data
    });
  },

  receivedUpdatedSessionInfoData: function(data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_UPDATED_SESSION_DATA,
      data: data
    });
  },

  updateSession: function(data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SAVE_SESSION,
      data: data
    });
  },
  updateTitle: function(title) {
    AppDispatcher.dispatch({
      actionType: AppConstants.UPDATE_TITLE,
      title: title
    });
  }
};

module.exports = SessionActions;
