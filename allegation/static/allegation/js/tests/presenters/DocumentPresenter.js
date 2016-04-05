var f = require('utils/tests/f');
var DocumentPresenter = require('presenters/DocumentPresenter');

require('tests/factories/DocumentFactory');
require('should');


describe('Document Presenter', function () {
  describe('#title', function () {
    it('returns correct document title for document type', function () {
      var crDocument = f.create('Document', { 'type': 'CR' });
      var cpbDocument = f.create('Document', { 'type': 'CPB' });

      var crPresenter = DocumentPresenter(crDocument);
      var cpbPresenter = DocumentPresenter(cpbDocument);

      crPresenter.title.should.equal('Investigation report');
      cpbPresenter.title.should.equal('Police board hearing');
    });

    it('returns empty if passing invalid document title', function () {
      var document = f.create('Document', { 'type': 'invalid' });
      var presenter = DocumentPresenter(document);

      presenter.title.should.equal('');
    });
  });

  describe('#status', function () {
    it('returns missing status for document that has not been requested', function () {
      var document = f.create('Document', { 'requested': false, 'documentcloud_id': 0 });
      var presenter = DocumentPresenter(document);

      presenter.status.should.be.equal('Missing');
    });

    it('returns available status for document that has documentcloud id', function () {
      var document = f.create('Document', { 'documentcloud_id': 1 });
      var presenter = DocumentPresenter(document);

      presenter.status.should.be.equal('Available');
    });

    it('returns pending status for document that is requested but no documentcloud id', function () {
      var document = f.create('Document', { 'requested': true, 'documentcloud_id': 0 });
      var presenter = DocumentPresenter(document);

      presenter.status.should.be.equal('Pending');
    });
  });

  describe('#documentUrl', function () {
    it('returns document cloud url for available document', function () {
      var document = f.create('Document', { 'documentcloud_id': 1, 'normalized_title': 'title' });
      var presenter = DocumentPresenter(document);

      presenter.documentUrl.should.be.equal('http://documentcloud.org/documents/1-title.html');
    });

    it('returns default value for unavailable document', function () {
      var document = f.create('Document', { 'documentcloud_id': 0 });
      var presenter = DocumentPresenter(document);

      presenter.documentUrl.should.be.equal('');
    });
  });
});
