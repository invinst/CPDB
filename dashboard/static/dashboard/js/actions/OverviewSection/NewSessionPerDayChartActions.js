var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var NewSessionPerDayChartActions = {
  receivedData: function (data) {
    console.log(data);
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_NEW_SESSIONS_DATA,
      data: data
    })
  }
};

module.exports = NewSessionPerDayChartActions;
