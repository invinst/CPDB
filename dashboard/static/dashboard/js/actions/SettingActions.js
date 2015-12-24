var toastr = require('toastr');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var StoryAPI = require('utils/StoryAPI');

var SettingActions = {
  receivedData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_SETTINGS_DATA,
      data: data
    });
  },

  update: function (field, value) {
    AppDispatcher.dispatch({
      actionType: AppConstants.UPDATE_SETTING_DATA,
      field: field,
      value: value
    });
  },

  settingsUpdated: function (response) {
    toastr.success("All settings are updated.");
    AppDispatcher.dispatch({
      actionType: AppConstants.UPDATED_SETTING_DATA,
      response: response
    });
  },

  failedToUpdateSettingData: function (response) {
    toastr.error("Server encountered an error while saving settings.");
    AppDispatcher.dispatch({
      actionType: AppConstants.FAILED_TO_UPDATE_SETTING_DATA,
      response: response
    });
  },

  getStoryTypes: function () {
    StoryAPI.suggestType('', this.receivedStoryTypes);
  },

  receivedStoryTypes: function (err, data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_STORY_TYPES_DATA,
      data: data
    });
  },

  dragTag: function (tag, currentPosition, newPosition) {
    AppDispatcher.dispatch({
      actionType: AppConstants.DRAG_STORY_TYPE_TAG,
      data: {
        tag: tag,
        currentPosition: currentPosition,
        newPosition: newPosition
      }
    });
  },
};

module.exports = SettingActions;
