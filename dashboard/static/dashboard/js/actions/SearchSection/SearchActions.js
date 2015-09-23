var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var SearchActions = {
  searchFor: function (query) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SEARCH_FOR_SUGGESTIONS,
      data: query
    })
  }
};

module.exports = SearchActions;
