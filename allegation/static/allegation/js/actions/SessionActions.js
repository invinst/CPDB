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

  createdSession: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.SESSION_CREATED
    });
  },

  receivedSharedSession: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_SHARED_SESSION,
      data: data
    });
  }
};

module.exports = SessionActions;
