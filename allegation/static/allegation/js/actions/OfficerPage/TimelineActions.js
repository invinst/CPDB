var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var TimelineActions = {
  receivedData: function (timeline) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_TIMELINE_DATA,
      data: timeline
    });
  }
};

module.exports = TimelineActions;
