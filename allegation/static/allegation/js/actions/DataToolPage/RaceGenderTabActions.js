var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var RaceGenderTabActions = {
  receivedData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RACE_GENDER_TAB_RECEIVED_DATA,
      data: data
    });
  }
};

module.exports = RaceGenderTabActions;
