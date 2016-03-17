var AppConstants = require('../constants/AppConstants');

var DocumentActions = require('actions/DocumentSection/DocumentActions');
var DocumentRequestAnalysisAPI = require('utils/DocumentRequestAnalysisAPI');


var DocumentRequestStatusAPI = {
  putStatus: function (document, status) {
    var params = {
      'id': document.id,
      'status': status
    };

    jQuery.post(AppConstants.DOCUMENT_REQUEST_STATUS_END_POINT, params, function (data) {
      switch (status) {
        case 'pending':
          DocumentActions.requestPutToPending(document);
          break;
        case 'requesting':
          DocumentActions.requestPendingCancelled(document);
          break;
        case 'missing':
          DocumentActions.requestCancel(document);
          break;
        default:
          break;
      }
      DocumentRequestAnalysisAPI.get();
    });
  }
};

module.exports = DocumentRequestStatusAPI;
