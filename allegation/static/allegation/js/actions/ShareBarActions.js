var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SessionAPI = require('utils/SessionAPI');


var ShareBarActions = {
  closeShareBar: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.CLOSE_SHARE_BAR
    });
  },

  openShareBar: function (currentHash) {
    SessionAPI.createSharedSession(currentHash);
  }
};

module.exports = ShareBarActions;
