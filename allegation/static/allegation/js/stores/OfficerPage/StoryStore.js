var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');

var CHANGE_THUMB_URL_EVENT = 'CHANGE_THUMB_URL_EVENT';

var _state = {
  story: null,
  thumbUrl: null
};

var StoryStore = _.assign(Base(_state), {
  emitChangeThumbUrl: function () {
    this.emit(CHANGE_THUMB_URL_EVENT);
  },

  removeChangeThumbUrlListener: function(callback) {
    this.removeListener(CHANGE_THUMB_URL_EVENT, callback);
  },

  addChangeThumbUrlListener: function (callback) {
    this.on(CHANGE_THUMB_URL_EVENT, callback);
  },

  isSameStory: function (story) {
    return story.id === _state.story.id;
  },

  getThumbUrl: function () {
    return _state.thumbUrl;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SET_STORY_DOCUMENT_THUMB:
      _state.thumbUrl = action.thumbUrl;
      _state.story = action.story;
      // setTimeout(function () {
      StoryStore.emitChangeThumbUrl();
      // }, 2000);
      break;

    default:
      break;
  }
});

module.exports = StoryStore;
