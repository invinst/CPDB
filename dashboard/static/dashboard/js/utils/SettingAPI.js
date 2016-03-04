var AppConstants = require('../constants/AppConstants');
var SettingActions = require('actions/SettingActions');

var ajax = null;
var SettingAPI;

global.jQuery = require('jquery');


SettingAPI = {
  get: function (query) {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.SETTINGS_API_ENDPOINT, function (data) {
      SettingActions.receivedData(data.results);
    });
  },

  save: function (setting) {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.ajax({
      type: 'PUT',
      url: AppConstants.SETTINGS_API_ENDPOINT + setting.id + '/',
      data: setting,
      success: function (response) {
        SettingActions.settingsUpdated(response);
      },
      error: function (response) {
        SettingActions.failedToUpdateSettingData(response);
      }
    });
  }
};

module.exports = SettingAPI;
