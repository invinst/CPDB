var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');

var TabsActions = {
  setActive: function (tab) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_OFFICER_TAB_ACTIVE,
      data: tab
    });
  }
};

module.exports = TabsActions;
