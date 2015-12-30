var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var SuggestionSectionActions = {
  goForSuggestionDetail: function (suggestion) {
    AppDispatcher.dispatch({
      actionType: AppConstants.GO_FOR_SEARCH_DETAIL,
      data: suggestion
    });
  }
};

module.exports = SuggestionSectionActions;
