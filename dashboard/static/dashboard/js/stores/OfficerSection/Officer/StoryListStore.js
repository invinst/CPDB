var _ = require('lodash');
var navigate = require('react-mini-router').navigate;

var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');
var StoryAPI = require('../../../utils/StoryAPI');
var Base = require('../../Base');


var _state = {
  stories: []
};

var StoryListStore = _.assign(Base(_state), {
  selectAll: function (selected) {
    for(var i = 0; i < _state.stories.length; i++) {
      _state.stories[i].selected = selected;
    }
    this.emitChange();
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.STORY_UPDATED:
    case AppConstants.STORY_CREATED:
    case AppConstants.STORY_DELETED:
    case AppConstants.DELETE_BULK_STORY:
      StoryAPI.get();
      break;


    case AppConstants.SET_ACTIVE_OFFICER:
    case AppConstants.RECEIVE_OFFICER:
      StoryAPI.get();
      break;

    case AppConstants.RECEIVED_STORY_LIST:
      _state.stories = action.data;
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
