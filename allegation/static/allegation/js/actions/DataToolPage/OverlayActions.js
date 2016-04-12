var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');


var OverlayActions = {
  toggleOverlay: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.TOGGLE_OVERLAY
    });
  }
};

module.exports = OverlayActions;
