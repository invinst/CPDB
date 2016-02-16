var _ = require('lodash');

var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');
var Base = require('../../Base');


var _state = {
  stories: [],
  'do_update_list': false
};

var StoryListStore = _.assign(Base(_state), {
  selectAll: function (selected) {
    for (var i = 0; i < _state.stories.length; i++) {
      _state.stories[i].selected = selected;
    }
    this.emitChange();
  },

  getSelectedStories: function () {
    return _.filter(_state.stories, function (x) { return x.selected; });
  },

  hasSelectedStories: function () {
    return this.getSelectedStories().length > 0;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.STORY_UPDATED:
    case AppConstants.STORY_CREATED:
    case AppConstants.STORY_DELETED:
    case AppConstants.DELETE_BULK_STORY:
    case AppConstants.SET_ACTIVE_OFFICER:
    case AppConstants.RECEIVE_OFFICER:
      _state['do_update_list'] = true;
      StoryListStore.emitChange();
      break;

    case AppConstants.RECEIVED_STORY_LIST:
      _state.stories = action.data;
      _state['do_update_list'] = false;
      StoryListStore.emitChange();
      break;

    case AppConstants.SELECT_STORY:
      action.story.selected = action.selected;
      StoryListStore.emitChange();
      break;

    case AppConstants.SELECT_ALL_STORY:
      StoryListStore.selectAll(action.selected);
      break;

    default:
      break;
  }
});

module.exports = StoryListStore;
