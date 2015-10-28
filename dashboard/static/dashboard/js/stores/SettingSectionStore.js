var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');
var Base = require('./Base');
var navigate = require('react-mini-router').navigate;

var _state = {
  settings: []
};

var SettingSectionStore = _.assign(Base(_state), {
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_SETTINGS_DATA:
      _state.settings = action.data;
      SettingSectionStore.emitChange();
      break;

    case AppConstants.UPDATE_SETTING_DATA:
      action.setting.value = action.value;
      SettingSectionStore.emitChange();
      break;

    case AppConstants.UPDATED_SETTING_DATA:
      SettingSectionStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = SettingSectionStore;
