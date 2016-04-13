var f, OfficerPagePresenter;

require('should');

f = require('utils/tests/f');

OfficerPagePresenter = require('presenters/Page/OfficerPagePresenter');


describe('OfficerPagePresenter', function () {
  describe('#complaints', function () {
    it('should return complaints sorted by `incident_date`', function () {
      var allegation1 = f.create('Allegation', {'incident_date': '2012-10-07T07:30:00'});
      var allegation2 = f.create('Allegation', {'incident_date': '2012-11-07T07:30:00'});
      var allegation3 = f.create('Allegation', {'incident_date': ''});

      var officerPageData = f.create('OfficerPageData', {'complaints': [allegation3, allegation1, allegation2]});

      var presenter = OfficerPagePresenter(officerPageData);
      presenter.complaints.should.be.eql([allegation2, allegation1, allegation3]);

    });
  });

  describe('#officerDetail', function () {
    it('should return officer', function () {
      var officer = f.create('Officer');
      var officerPageData = f.create('OfficerPageData', {'detail': officer});

      var presenter = OfficerPagePresenter(officerPageData);

      presenter.officerDetail.should.be.eql(officer);
    });
  });

  describe('#coAccused ', function () {
    it('should return co-accused officer', function () {
      var officers = f.createBatch(2, 'Officer');
      var officerPageData = f.create('OfficerPageData', {'co_accused': officers});

      var presenter = OfficerPagePresenter(officerPageData);

      presenter.coAccused.should.be.eql(officers);
    });
  });

  describe('#distribution', function () {
    it('should return distribution list', function () {
      var distributions = [1,3,4];
      var officerPageData = f.create('OfficerPageData', {'distribution': distributions});

      var presenter = OfficerPagePresenter(officerPageData);

      presenter.distribution.should.eql(distributions);
    });
  });

});
