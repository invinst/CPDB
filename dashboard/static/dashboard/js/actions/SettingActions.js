var toastr = require('toastr');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var SettingActions = {
  receivedData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_SETTINGS_DATA,
      data: data
    });
  },

  update: function (setting, value) {
    AppDispatcher.dispatch({
      actionType: AppConstants.UPDATE_SETTING_DATA,
      setting: setting,
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
};

module.exports = SettingActions;
