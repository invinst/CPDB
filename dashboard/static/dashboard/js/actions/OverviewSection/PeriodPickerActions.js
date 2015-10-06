var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var PeriodPickerActions = {
  setPeriod: function (period) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_PERIOD,
      period: period
    })
  }
};

module.exports = PeriodPickerActions;
