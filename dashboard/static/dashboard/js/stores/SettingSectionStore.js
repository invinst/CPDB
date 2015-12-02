var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');
var Base = require('./Base');
var navigate = require('react-mini-router').navigate;

var _state = {
  setting: {},
  story_types: [],
  tags: [],
};

var SettingSectionStore = _.assign(Base(_state), {
  generateTags: function () {
    if (_state.setting.story_types_order != undefined) {
      tags = _.compact(_.union(_state.setting.story_types_order.split(','), _state.story_types))
      _state.tags = tags.map(function (value, index) {
        return {
          id: index,
          text: value
        }
      });
    }
  },

  setStoryTypes: function (storyTypes) {
    _state.story_types = storyTypes.map(function(item) {
      return item.label;
    });
  },

  updateSettingStoryTypes: function () {
    _state.setting.story_types_order = _.pluck(_state.tags, 'text').join(',');
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_SETTINGS_DATA:
      _state.setting = action.data[0];
      SettingSectionStore.generateTags();
      SettingSectionStore.emitChange();
      break;

    case AppConstants.UPDATE_SETTING_DATA:
      _state.setting[action.field] = action.value;
      SettingSectionStore.emitChange();
      break;

    case AppConstants.RECEIVED_STORY_TYPES_DATA:
      SettingSectionStore.setStoryTypes(action.data.options);
      SettingSectionStore.generateTags();
      SettingSectionStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = SettingSectionStore;
