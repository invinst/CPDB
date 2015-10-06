var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var OfficerPageAPIUtil = require('utils/OfficerPageAPIUtil');

var OfficerPageActions = {
  receivedOfficerData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_OFFICER_DATA,
      data: data
    });
  }
};

module.exports = OfficerPageActions;
