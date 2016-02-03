var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var StoryListActions = {
  setThumbUrl: function (story, thumbUrl) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_STORY_DOCUMENT_THUMB,
      story: story,
      thumbUrl: thumbUrl
    });
  }
};

module.exports = StoryListActions;
