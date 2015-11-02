var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');

var SunburstActions = {
  receivedData: function(data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_SUNBURST_DATA,
      data: data
    });
  },

  selectArc: function (path) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SUNBURST_SELECT_ARC,
      data: path
    });
  },
};

module.exports = SunburstActions;
