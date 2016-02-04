var AppConstants = require('../constants/AppConstants');
var TabsActions = require('../actions/DocumentSection/TabsActions');


var ajax = null;

var DocumentRequestAnalysisAPI = {
  get: function () {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.DOCUMENT_REQUEST_ANALYSIS_END_POINT, function (data) {
      TabsActions.receivedDocumentRequestAnalysis(data);
    });
  }
};

module.exports = DocumentRequestAnalysisAPI;
