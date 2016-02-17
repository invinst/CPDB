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
  },

  shareToFB: function (hashId, newTitle, sharedUrl) {
    SessionAPI.updateSessionRequest({'hash': hashId, 'title': newTitle})
    .then(function () {
      window.open(
        'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(sharedUrl),
        'pop', 'width=600, height=400, scrollbars=no'
      );
    });
  }
};

module.exports = ShareBarActions;
