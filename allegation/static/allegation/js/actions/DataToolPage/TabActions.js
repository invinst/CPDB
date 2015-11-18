var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var SessionAPI = require('utils/SessionAPI');

var TabActions = {
  setActiveTab: function(tab) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_TAB,
      data: tab
    });
    SessionAPI.updateSessionInfo({'active_tab': tab});
  }
};

module.exports = TabActions;
