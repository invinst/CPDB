var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var RaceGenderAPI = require('utils/RaceGenderAPI');
var SunburstAPI = require('utils/SunburstAPI');

var SessionActions = {
  receivedSessionInfoData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_SESSION_DATA,
      data: data
    });
    RaceGenderAPI.getData();
    SunburstAPI.getData();
  },

  receivedUpdatedSessionInfoData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_UPDATED_SESSION_DATA,
      data: data
    });
  },

  updateSession: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SAVE_SESSION,
      data: data
    });
  },
  updateTitle: function (title) {
    AppDispatcher.dispatch({
      actionType: AppConstants.UPDATE_TITLE,
      title: title
    });
  },
  createdSession: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.SESSION_CREATED
    });
  }
};

module.exports = SessionActions;
