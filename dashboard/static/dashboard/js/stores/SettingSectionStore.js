var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');
var Base = require('./Base');
var navigate = require('react-mini-router').navigate;

var _state = {
  setting: {}
};

var SettingSectionStore = _.assign(Base(_state), {
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_SETTINGS_DATA:
      _state.setting = action.data[0];
      SettingSectionStore.emitChange();
      break;

    case AppConstants.UPDATE_SETTING_DATA:
      _state.setting[action.field] = action.value;
      SettingSectionStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = SettingSectionStore;
