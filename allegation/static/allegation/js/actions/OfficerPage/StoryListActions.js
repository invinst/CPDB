var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var StoryListActions = {
  receiveStories: function (stories) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVE_STORIES,
      data: stories
    });
  }
};

module.exports = StoryListActions;
