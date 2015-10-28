global.jQuery = require('jquery');

var AppConstants = require('../constants/AppConstants');
var SettingActions = require('actions/SettingActions');

var ajax = null;
var limit = 0;
var count = 20;

var SettingAPI = {
  get: function (query) {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.SETTINGS_API_ENDPOINT, function(data) {
      SettingActions.receivedData(data.results);
    });
  },

  save: function (data) {
    if (ajax) {
      ajax.abort();
    }

    params = {};
    data.forEach(function(setting) {
      params[setting.key] = setting.value;
    });

    ajax = jQuery.post(AppConstants.SETTINGS_API_SAVE_ENDPOINT, params, function(response) {
      SettingActions.settingsUpdated(response);
    }, 'json');
  }
};

module.exports = SettingAPI;
