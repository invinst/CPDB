var u = require('utils/HelperUtil');


var DocumentLinkPresenter = function (documentId, documentNormalizedTitle) {
  var makeLinkFor = function (extension) {
    var linkFormat = 'http://documentcloud.org/documents/{documentId}-{documentNormalizedTitle}.{extension}';

    return u.format(linkFormat, {
      'documentId': documentId,
      'documentNormalizedTitle': documentNormalizedTitle,
      'extension': extension
    });
  };

  return {
    pdfLink: makeLinkFor('pdf'),
    cloudLink: makeLinkFor('html')
  };
};

module.exports = DocumentLinkPresenter;
