var toastr = require('toastr');

var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');

var OfficerAction = {
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
  }
};

module.exports = OfficerAction;
