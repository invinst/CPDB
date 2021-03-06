var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var TabsActions = {
  setActive: function (tab) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_SESSION_ACTIVE_TAB,
      data: tab
    });
  }
};

module.exports = TabsActions;
