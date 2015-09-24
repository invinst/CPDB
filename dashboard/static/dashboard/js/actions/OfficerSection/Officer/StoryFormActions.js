var toastr = require('toastr');

var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');

var OfficerAction = {
  updateField: function (field, value) {
    AppDispatcher.dispatch({
      actionType: AppConstants.UPDATE_STORY_DATA,
      field: field,
      value: value
    });
  },

  createdStory: function (story) {
    toastr.success("New story has been created.");
    AppDispatcher.dispatch({
      actionType: AppConstants.STORY_CREATED,
      data: story
    });
  },

  updatedStory: function (story) {
    toastr.success("Story has been updated.");
    AppDispatcher.dispatch({
      actionType: AppConstants.STORY_UPDATED,
      data: story
    });
  }
};

module.exports = OfficerAction;
