var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var SunburstActions = {
  receivedData: function(data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_SUNBURST_DATA,
      data: data
    });
  },

  selectArc: function (path, selected) {
    ga('send', 'event', 'filter', 'sunburst', path.name);
    AppDispatcher.dispatch({
      actionType: AppConstants.SUNBURST_SELECT_ARC,
      arc: path,
      selected: selected
    });
  },

  hoverArc: function (path) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SUNBURST_HOVER_ARC,
      data: path
    });
  },

  leaveArc: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.SUNBURST_LEAVE_ARC
    });
  },

  clearControl: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.SUNBURST_CLEAR_CONTROL
    });
  }
};

module.exports = SunburstActions;
