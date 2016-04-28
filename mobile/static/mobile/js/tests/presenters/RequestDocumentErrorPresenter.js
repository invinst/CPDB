var RequestDocumentErrorPresenter = require('presenters/RequestDocumentErrorPresenter');

require('should');


describe('RequestDocumentErrorPresenter', function () {
  describe('#errorMessage', function () {
    it('should return `Please provide a valid email` if the error is related to email', function () {
      var errors = {'email': 'error message'};
      var presenter = RequestDocumentErrorPresenter(errors);

      presenter.errorMessage.should.containEql('Please provide a valid email');
    });

    it('should return `An issue has occurred` if the error is unknown', function () {
      var errors = {'other': 'error message'};
      var presenter = RequestDocumentErrorPresenter(errors);

      presenter.errorMessage.should.containEql('An issue has occurred');
    });
  });
});
