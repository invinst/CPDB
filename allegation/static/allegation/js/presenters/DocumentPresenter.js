var AppConstants = require('../constants/AppConstants.js');


var DocumentPresenter = function (document) {
  var documentStatus = function () {
    if (document.documentcloud_id > 0) {
      return 'Available';
    }

    if (document.requested) {
      return 'Pending';
    }

    return 'Missing';
  };

  var documentTitle = function () {
    return AppConstants.DOCUMENT_TYPE_NAMES[document.type] || '';
  };

  var documentUrl = function () {
    return 'http://documentcloud.org/documents/' + document.documentcloud_id + '-' +
             document.normalized_title +'.html';
  };

  return {
    title: documentTitle(),
    status: documentStatus(),
    documentUrl: documentUrl()
  };
};

module.exports = DocumentPresenter;
