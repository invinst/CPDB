var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var OutcomeAnalysisServerActionCreator = {
  receivedAnalysisInformation: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_OUTCOME_FILTER_ANALYSIS,
      data: data
    });
  }
};

module.exports = OutcomeAnalysisServerActionCreator;
