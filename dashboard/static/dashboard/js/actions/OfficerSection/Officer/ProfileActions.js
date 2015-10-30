var toastr = require('toastr');

var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');

var OfficerAction = {
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
  },

  resetForm: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.RESET_OFFICER_DATA
    });
  }
};

module.exports = OfficerAction;
