var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var OfficerAction = {
  setOfficer: function (officer) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_OFFICER,
      data: officer
    });
  },
  receivedOfficer: function (officer) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVE_OFFICER,
      data: officer
    });
  }
};

module.exports = OfficerAction;
