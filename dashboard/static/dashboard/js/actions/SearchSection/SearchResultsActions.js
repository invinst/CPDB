var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var SearchResultsActions = {
  receivedSearchResultsData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_SEARCH_RESULTS_DATA,
      data: data
    });
  },

  receivedMore: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.LOAD_MORE_SEARCH_RESULTS_DATA,
      data: data
    });
  }
};

module.exports = SearchResultsActions;
