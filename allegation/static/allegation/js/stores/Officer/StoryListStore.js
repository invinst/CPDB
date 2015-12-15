/**
 * Created by eastagile on 7/31/15.
 */
var _ = require('lodash');

var AppConstants = require('../../constants/AppConstants');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var Base = require('stores/Base')

var _state = {
  stories: [],
  story_groups: {}
}

var StoryListStore = _.assign(Base(_state), {

});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RECEIVE_STORIES:
      _state.stories = action.data;
      StoryListStore.emitChange();
      break;

    case AppConstants.SET_STORY_DOCUMENT_THUMB:
      action.story.thumbUrl = action.thumbUrl;
      setTimeout(function () {
        StoryListStore.emitChange();
      }, 2000);
      break;

    default:
      break;
  }
});

module.exports = StoryListStore;


