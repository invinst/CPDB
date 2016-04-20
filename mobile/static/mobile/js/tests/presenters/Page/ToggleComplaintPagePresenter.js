var f, ToggleComplaintPagePresenter;
require('should');

f = require('utils/tests/f');
ToggleComplaintPagePresenter = require('presenters/Page/ToggleComplaintPagePresenter');


describe('ToggleComplaintPagePresenter', function () {
  describe('#groupByCategory', function () {
    it('should return the officer allegations which are sorted by category', function () {
      var cat1 = f.create('Category', {'id': 123});
      var cat2 = f.create('Category', {'id': 456});

      var cat1OfficerAllegations = f.create('OfficerAllegation', {'cat': cat1});
      var cat2OfficerAllegations = f.create('OfficerAllegation', {'cat': cat2});
      var officerAllegations = [cat1OfficerAllegations, cat2OfficerAllegations];

      var presenter = ToggleComplaintPagePresenter(officerAllegations);
      var grouped = presenter.groupByCategory;

      grouped.should.have.property(cat1.id);
      grouped[cat1.id].should.have.length(1);
      grouped.should.have.property(cat2.id);
      grouped[cat2.id].should.have.length(1);
    });
  });
});
