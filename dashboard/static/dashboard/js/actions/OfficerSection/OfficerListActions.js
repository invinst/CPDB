var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var OfficerListAction = {
  receivedOfficerList: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_OFFICER_LIST,
      data: data
    });
  }
};

module.exports = OfficerListAction;
