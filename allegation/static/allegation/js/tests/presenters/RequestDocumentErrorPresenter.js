var RequestDocumentErrorPresenter = require('presenters/RequestDocumentErrorPresenter');

require('should');

describe('RequestDocumentErrorPresenter', function () {
  describe('#errorMessage', function () {
    it('should return `Please provide a valid email address` if email error', function () {
      var errors = {'email': 'email error'};
      var presenter = RequestDocumentErrorPresenter(errors);

      presenter.errorMessage.should.equal('Please provide a valid email address');
    });

    it('should return `An error has occurred while processing your request` if not email error', function () {
      var errors = {'something': 'some errors'};
      var presenter = RequestDocumentErrorPresenter(errors);

      presenter.errorMessage.should.equal('An error has occurred while processing your request');
    });
  });
});
