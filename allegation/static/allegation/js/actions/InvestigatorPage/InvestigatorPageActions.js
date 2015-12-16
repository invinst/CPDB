var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var InvestigatorPageActions = {
  receivedInvestigatorData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_INVESTIGATOR_DATA,
      data: data
    });
  }
};

module.exports = InvestigatorPageActions;
