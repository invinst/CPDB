var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');


var OverlayActions = {
  toggleOverlay: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.TOGLLE_OVERLAY
    });
  }
};

module.exports = OverlayActions;
