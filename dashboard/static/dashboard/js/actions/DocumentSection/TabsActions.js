var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var DocumentRequestAPI = require('../../utils/DocumentRequestAPI');

var TabsActions = {
  setActive: function (tab) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_DOCUMENT_ACTIVE_TAB,
      data: tab
    });
  }
};

module.exports = TabsActions;
