var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var ComplaintListAPI = require('../../utils/ComplaintListAPI');

var ComplaintListActions = {
  getMoreData: function(pageNumber) {
    AppDispatcher.dispatch({
      actionType: AppConstants.COMPLAINT_LIST_GET_MORE_DATA
    });
    ComplaintListAPI.getMoreData(pageNumber)
  }
};

module.exports = ComplaintListActions;
