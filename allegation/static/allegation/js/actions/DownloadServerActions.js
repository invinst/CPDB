var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var DownloadServerActions = {
  completeGeneratedDownload: function (href) {
    AppDispatcher.dispatch({
      actionType: AppConstants.GENERATED_DOWNLOAD,
      href: href
    });
  }
};

module.exports = DownloadServerActions;
