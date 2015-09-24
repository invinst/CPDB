var toastr = require('toastr');

var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');

var OfficerAction = {
  updateField: function (field, value) {
    AppDispatcher.dispatch({
      actionType: AppConstants.UPDATE_STORY_DATA,
      field: field,
      value: value
    });
  },

};

module.exports = OfficerAction;
