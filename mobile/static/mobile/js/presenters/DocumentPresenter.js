var AppConstants = require('constants/AppConstants');

var DeviceUtil = require('utils/DeviceUtil');
var u = require('utils/HelperUtil');


var DocumentPresenter = function (document) {
  var documentType = function () {
    return u.fetch(document, 'type', '');
  };

  var documentCloudId = function () {
    return u.fetch(document, 'documentcloud_id', '');
  };

  var documentNormalizedTitle = function () {
    return u.fetch(document, 'normalized_title', '');
  };

  var documentName = function () {
    var type = documentType();
    return AppConstants.DOCUMENT_NAMES[type] || 'Unknown type';
  };

  var documentStatus = function () {
    var documentId = documentCloudId();
    var requested = u.fetch(document, 'requested', false);

    if (documentId) {
      return 'Available';
    }

    if (requested) {
      return 'Pending';
    }

    return 'Missing';
  };

  var documentAction = function () {
    var STATUS_TO_ACTION = {
      'Available': 'View',
      'Pending': 'Follow',
      'Missing': 'Request'
    };

    var status = documentStatus();
    return STATUS_TO_ACTION[status];
  };

  var makeLinkFor = function (extension) {
    var linkFormat = 'http://documentcloud.org/documents/{documentId}-{documentNormalizedTitle}.{extension}';

    return u.format(linkFormat, {
      'documentId': documentCloudId(),
      'documentNormalizedTitle': documentNormalizedTitle(),
      'extension': extension
    });
  };

  var documentLink = function () {
    if (DeviceUtil.isiOSDevice()) {
      return makeLinkFor('pdf');
    }

    return makeLinkFor('html');
  };

  return {
    documentName: documentName(),
    documentStatus: documentStatus(),
    documentAction: documentAction(),
    documentLink: documentLink()
  };
};

module.exports = DocumentPresenter;
