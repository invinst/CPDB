var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var ComplaintPageActions = {
  toggleOpen: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.TOGGLE_PAGE_OPEN
    });
  },
  toggleClose: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.TOGGLE_PAGE_CLOSE
    });
  }
};

module.exports = ComplaintPageActions;
