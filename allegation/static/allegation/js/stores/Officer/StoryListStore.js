/**
 * Created by eastagile on 7/31/15.
 */
var _ = require('lodash');

var AppConstants = require('../../constants/AppConstants');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var Base = require('stores/Base');

var _state = {
  stories: [],
  storyGroups: {}
};

var StoryListStore = _.assign(Base(_state), {

});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RECEIVE_STORIES:
      _state.stories = action.data;
      StoryListStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = StoryListStore;


