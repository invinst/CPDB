var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var DownloadActions = {
  process: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.DOWNLOAD_PROCESS
    });
  },
};

module.exports = DownloadActions;
