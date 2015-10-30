var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var SearchActions = {
  search: function (query) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SEARCH_OFFICER_WITH_QUERY,
      data: query
    })
  }
};

module.exports = SearchActions;
