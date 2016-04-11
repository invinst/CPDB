var f = require('utils/tests/f');

var OfficerPresenter = require('presenters/OfficerPresenter');

require('tests/factories/OfficerFactory');
require('should');

describe('OfficerPresenter', function () {
  describe('#url', function () {
    it('should return the mobile url for officer page', function () {
      var officer = f.create('Officer', {'id': 1, 'officer_first': 'first', 'officer_last': 'last'});
      var presenter = OfficerPresenter(officer);

      var expectedUrl = '/officer/first-last/1';
      presenter.url.should.be.eql(expectedUrl);
    });
  });
});
