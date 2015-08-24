var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var ComplaintListServerActions = {
  receivedData: function(data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.COMPLAINT_LIST_RECEIVED_DATA,
      data: data
    })
  },

  receivedMoreData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.COMPLAINT_LIST_RECEIVED_MORE_DATA,
      data: data
    })
  },
};

module.exports = ComplaintListServerActions;
