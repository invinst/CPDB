var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var QueriesDataServerActions = {
  receivedQueriesData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_QUERIES_DATA,
      data: data
    })
  }
};

module.exports = QueriesDataServerActions;
