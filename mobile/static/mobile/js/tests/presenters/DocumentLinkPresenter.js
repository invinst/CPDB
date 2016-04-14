var DocumentLinkPresenter;

require('should');

DocumentLinkPresenter = require('presenters/DocumentLinkPresenter');

describe('DocumentLinkPresenter', function () {
  it('should return pdf link', function () {

    var presenter = DocumentLinkPresenter('12345', 'cr-12345');
    var link = 'http://documentcloud.org/documents/12345-cr-12345.pdf';

    presenter.pdfLink.should.be.equal(link);
  });

  it('should return cloudLink link', function () {

    var presenter = DocumentLinkPresenter('12345', 'cr-12345');
    var link = 'http://documentcloud.org/documents/12345-cr-12345.html';

    presenter.cloudLink.should.be.equal(link);
  });

});
