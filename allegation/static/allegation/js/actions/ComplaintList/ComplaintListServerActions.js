var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var ComplaintListServerActions = {
  getData: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.COMPLAINT_LIST_GET_DATA
    });
  },

  receivedData: function (data, fromFilter) {
    AppDispatcher.dispatch({
      actionType: AppConstants.COMPLAINT_LIST_RECEIVED_DATA,
      data: data,
      fromFilter: fromFilter
    });
  },

  receivedMoreData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.COMPLAINT_LIST_RECEIVED_MORE_DATA,
      data: data
    });
  },

  receivedFullComplaints: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.OFFICER_COMPLAINT_LIST_RECEIVED_DATA,
      data: data
    });
  }
};

module.exports = ComplaintListServerActions;
