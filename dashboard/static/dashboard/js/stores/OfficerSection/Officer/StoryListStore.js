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

});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.STORY_UPDATED:
    case AppConstants.STORY_CREATED:
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

    default:
      break;
  }
});

module.exports = StoryListStore;
