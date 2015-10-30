var AppConstants = require('../constants/AppConstants');

var DocumentActions = require('../actions/DocumentSection/DocumentActions');


var ajax = null;

var DocumentRequestStatusAPI = {
  putTo: function (allegation, status) {
    if (ajax) {
      ajax.abort();
    }

    jQuery.post(AppConstants.DOCUMENT_REQUEST_STATUS_END_POINT, {crid: allegation.crid, status: status}, function (data) {
      switch (status) {
        case 'pending':
          DocumentActions.requestPutToPending(allegation);
          break;
        case 'requesting':
          DocumentActions.requestPendingCancelled(allegation);
          break;
        default:
          break;
      }
    })
  }
};

module.exports = DocumentRequestStatusAPI;
