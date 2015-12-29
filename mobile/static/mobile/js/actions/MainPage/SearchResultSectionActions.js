var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var SearchResultSectionActions = {
  changeTab: function (tab) {
    AppDispatcher.dispatch({
      actionType: AppConstants.CHANGE_TAB,
      data: tab
    });
  }
};

module.exports = SearchResultSectionActions;
