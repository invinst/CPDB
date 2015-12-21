var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var OfficerPageActions = {
  changeTab: function (tab) {
    AppDispatcher.dispatch({
      actionType: AppConstants.CHANGE_TAB,
      data: tab
    });
  },
};

module.exports = OfficerPageActions;