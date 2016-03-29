var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var ComplaintPageAction = {
  click: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.COMPLAINT_PAGE_TOGGLE_MENU
    });
  },
  toggleClose: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.TOGGLE_PAGE_CLOSE
    });
  }
};

module.exports = ComplaintPageAction;
