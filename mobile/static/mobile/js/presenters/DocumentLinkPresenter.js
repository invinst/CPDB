var HelperUtil = require('utils/HelperUtil');


var DocumentLinkPresenter = function (documentId, documentNormalizedTitle) {
  var makeLinkFor = function (extension) {
    var linkFormat = 'http://documentcloud.org/documents/{documentId}-{documentNormalizedTitle}.{extension}';

    return HelperUtil.format(linkFormat, {
      'documentId': documentId,
      'documentNormalizedTitle': documentNormalizedTitle,
      'extension': extension
    });
  };

  var pdfLink = function () {
    return makeLinkFor('pdf');
  };

  var cloudLink = function () {
    return makeLinkFor('html');
  };

  return {
    pdfLink: pdfLink(),
    cloudLink: cloudLink()
  }
};

module.exports = DocumentLinkPresenter;
