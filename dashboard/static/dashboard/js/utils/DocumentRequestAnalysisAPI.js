var AppConstants = require('../constants/AppConstants');
var TabsActions = require('actions/DocumentSection/TabsActions');
var TabsStore = require('stores/DocumentSection/TabsStore');


var ajax = null;

var DocumentRequestAnalysisAPI = {
  get: function () {
    if (ajax) {
      ajax.abort();
    }

    var params = {
      type: TabsStore.getState().documentType
    };

    ajax = jQuery.getJSON(AppConstants.DOCUMENT_REQUEST_ANALYSIS_END_POINT, params, function (data) {
      TabsActions.receivedDocumentRequestAnalysis(data);
    });
  }
};

module.exports = DocumentRequestAnalysisAPI;
