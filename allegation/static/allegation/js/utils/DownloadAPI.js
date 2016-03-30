var AppConstants = require('constants/AppConstants');
var DownloadServerActions = require('actions/DownloadServerActions');

var listener = null;


var DownloadAPI = {
  process: function (query) {
    if (listener) {
      clearInterval(listener);
      listener = null;
    }

    jQuery.post('/allegations/download/?' + query, function (data) {
      listener = setInterval(function () {
        jQuery.getJSON('/allegations/download/', {id: data.download.id}, function (result) {
          var href;

          if (result.download.finished) {
            clearInterval(listener);
            listener = null;

            href = AppConstants.MEDIA_URL + result.download.url;
            DownloadServerActions.completeGeneratedDownload(href);
          }
        }).fail(function () {
          clearInterval(listener);
        });
      }, 5000);
      global.downloadListener = listener;
    });
  }
};

module.exports = DownloadAPI;
