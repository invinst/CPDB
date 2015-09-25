var toastr = require('toastr');

var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');

var StoryListAction = {
  receivedStoryList: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_STORY_LIST,
      data: data
    });
  },

  edit: function (story) {
    AppDispatcher.dispatch({
      actionType: AppConstants.EDIT_STORY,
      data: story
    });
  },

  deletedStory: function (story) {
    toastr.success('Story "' + story.title + '" has been deleted.');
    AppDispatcher.dispatch({
      actionType: AppConstants.STORY_DELETED,
      data: story
    });
  },

  selectCheckbox: function (story, selected) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SELECT_STORY,
      story: story,
      selected: selected
    });
  },

  selectAllCheckbox: function (selected) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SELECT_ALL_STORY,
      selected: selected
    });
  },

  deletedStories: function (stories) {
    toastr.success('Stories have been deleted.');
    AppDispatcher.dispatch({
      actionType: AppConstants.DELETE_BULK_STORY,
      stories: stories
    });
  }
};

module.exports = StoryListAction;
