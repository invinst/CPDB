var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var SearchTrafficServerActions = {
  receivedSearchTrafficData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_SEARCH_TRAFFIC_DATA,
      data: data
    });
  }
};

module.exports = SearchTrafficServerActions;
