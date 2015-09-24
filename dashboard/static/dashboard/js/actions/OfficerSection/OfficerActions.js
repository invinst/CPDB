var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var OfficerAPI = require('../../utils/OfficerAPI');
var toastr = require('toastr');

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
  },
  updateField: function (field, value) {
    AppDispatcher.dispatch({
      actionType: AppConstants.UPDATE_OFFICER_DATA,
      field: field,
      value: value
    });
  },

  officerProfileUpdated: function (officer, origin) {
    toastr.success("Officer profile has been updated.");
    AppDispatcher.dispatch({
      actionType: AppConstants.UPDATED_OFFICER_DATA,
      officer: officer,
      origin: origin
    });
  }
};

module.exports = OfficerAction;
