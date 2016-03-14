var _ = require('lodash');
var moment = require('moment');

var AppConstants = require('../constants/AppConstants');


var AllegationDocumentPresenter = function (document) {
  var documentStatusFunc = function (doc) {
    if (doc) {
      if (doc.documentcloud_id) {
        return 'fulfilled';
      }

      if (doc.requested) {
        if (doc.pending) {
          return 'pending';
        }

        return 'requesting';
      }
    }

    return 'missing';
  };

  var formatDate = function (document) {
    var lastRequested = _.get(document, 'last_requested');
    if (_.get(document, 'last_requested')) {
      return moment(lastRequested).format(AppConstants.HUMAN_READABLE_FORMAT)
    }

    return '';
  };

  var documentStatus = documentStatusFunc(document);
  var statusObj = AppConstants.DOCUMENT_STATUS[documentStatus];

  return {
    id: _.get(document, 'id', 0),
    crid: _.get(document, 'allegation', ''),
    documentStatus: documentStatus,
    documentStatusIcon: statusObj.icon,
    documentStatusText: statusObj.text,
    numberOfDocumentRequests: _.get(document, 'number_of_request', 0),
    lastRequested: formatDate(document),
    documentcloudId: _.get(document, 'documentcloud_id', 0),
    documentRequested: _.get(document, 'requested', false),
    documentPending: _.get(document, 'pending', false),
    rawDocument: document
  };
};

module.exports = AllegationDocumentPresenter;
