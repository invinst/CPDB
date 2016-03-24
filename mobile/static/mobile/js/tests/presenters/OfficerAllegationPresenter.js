var f = require('utils/tests/f');

var OfficerAllegationPresenter = require('presenters/OfficerAllegationPresenter');
var AppConstants = require('constants/AppConstants');
var moment = require('moment');

require('tests/factories/OfficerAllegationFactory');
require('should');

describe('OfficerAllegationPresenter', function () {
  describe('#category', function () {
    it('should return category', function () {
      var allegationCategory = 'allegationCategory';
      var category = f.create('Category', { 'category': allegationCategory });
      var officerAllegation = f.create('OfficerAllegation', { 'cat': category });

      var presenter = OfficerAllegationPresenter(officerAllegation);
      presenter.category.should.be.equal(allegationCategory);
    });

    it('should return Unknown if there is no category', function () {
      var allegation = f.create('OfficerAllegation', { 'cat': null });
      var presenter = OfficerAllegationPresenter(allegation);

      presenter.category.should.be.equal('Unknown');
    });
  });

  describe('#allegationName', function () {
    it('should return allegation name', function () {
      var allegationName = 'allegationCategory';
      var category = f.create('Category', { 'allegation_name': allegationName });
      var officerAllegation = f.create('OfficerAllegation', { 'cat': category });

      var presenter = OfficerAllegationPresenter(officerAllegation);
      presenter.allegationName.should.be.equal(allegationName);
    });

    it('should return empty if there is no category', function () {
      var officerAllegation = f.create('OfficerAllegation', { 'cat': null });
      var presenter = OfficerAllegationPresenter(officerAllegation);

      presenter.allegationName.should.be.equal('');
    });
  });

  describe('#startDateDisplay', function () {
    it('should return start investigation date', function () {
      var date = '2012-01-19';
      var expectedDate = 'Jan 19, 2012';
      var officerAllegation = f.create('OfficerAllegation', { 'start_date': date });

      var presenter = OfficerAllegationPresenter(officerAllegation);

      presenter.startDateDisplay.should.be.equal(expectedDate);
    });
  });

  describe('#endDateDisplay', function () {
    it('#endDateDisplay: should return end investigation date', function () {
      var date = '2012-01-19';
      var expectedDate = 'Jan 19, 2012';
      var officerAllegation = f.create('OfficerAllegation', { 'end_date': date });

      var presenter = OfficerAllegationPresenter(officerAllegation);
      presenter.endDateDisplay.should.be.equal(expectedDate);
    });
  });

  describe('#startInvestigatingAt(incidentDate)', function () {
    it('should return true if start date is same with incident date', function () {
      var date = '2012-01-19';
      var officerAllegation = f.create('OfficerAllegation', { 'start_date': date });
      var incidentDate = moment('2012-01-19', AppConstants.SIMPLE_SERVER_DATE_FORMAT);
      var presenter = OfficerAllegationPresenter(officerAllegation);

      presenter.startInvestigatingAt(incidentDate).should.be.equal(true);
    });

    it('should return true if start date is same with incident date', function () {
      var date = '2012-01-20';
      var officerAllegation = f.create('OfficerAllegation', { 'start_date': date });
      var incidentDate = moment('2012-01-19', AppConstants.SIMPLE_SERVER_DATE_FORMAT);
      var presenter = OfficerAllegationPresenter(officerAllegation);

      presenter.startInvestigatingAt(incidentDate).should.be.equal(false);
    });
  });

  describe('#haveEnoughDataForTimeline(incidentDate)', function () {
    it('should return true if have start date', function () {
      var date = '2012-01-20';
      var officerAllegation = f.create('OfficerAllegation', { 'start_date': date });
      var presenter = OfficerAllegationPresenter(officerAllegation);

      presenter.haveEnoughDataForTimeline(null).should.be.equal(true);
    });

    it('should return true if have incident date', function () {
      var officerAllegation = f.create('OfficerAllegation', { 'start_date': null });
      var presenter = OfficerAllegationPresenter(officerAllegation);

      presenter.haveEnoughDataForTimeline(moment()).should.be.equal(true);
    });

    it('should return false if there is no incident date and no start date',
      function () {
        var officerAllegation = f.create('OfficerAllegation', { 'start_date': null });
        var presenter = OfficerAllegationPresenter(officerAllegation);

        presenter.haveEnoughDataForTimeline(null).should.be.equal(false);
      }
    );
  });

  describe('#isOpenInvestigation', function () {
    it('should return true final outcome class is open-investigation', function () {
      var officerAllegation = f.create('OfficerAllegation', { 'final_outcome_class': 'open-investigation' });
      var presenter = OfficerAllegationPresenter(officerAllegation);

      presenter.isOpenInvestigation.should.be.equal(true);
    });

    it('should return false final outcome class is not open-investigation', function () {
      var officerAllegation = f.create('OfficerAllegation', { 'final_outcome_class': 'not-sustained' });
      var presenter = OfficerAllegationPresenter(officerAllegation);

      presenter.isOpenInvestigation.should.be.equal(false);
    });
  });

  describe('#finalStatus', function () {
    it('should return `Open Investigation` final outcome class is open-investigation', function () {
      var officerAllegation = f.create('OfficerAllegation', { 'final_outcome_class': 'open-investigation' });
      var presenter = OfficerAllegationPresenter(officerAllegation);

      presenter.finalStatus.should.be.equal('Open Investigation');
    });

    it('should return `Investigation Closed` with status of investigation', function () {
      var officerAllegation = f.create('OfficerAllegation', { 'final_finding': 'ex' });
      var presenter = OfficerAllegationPresenter(officerAllegation);

      presenter.finalStatus.should.be.equal('Investigation Closed (Exonerated)');
    });
  });

  describe('#finalFinding', function () {
    it('should return `Unknown` if empty', function () {
      var officerAllegation = f.create('OfficerAllegation', { 'final_finding': '' });
      var presenter = OfficerAllegationPresenter(officerAllegation);

      presenter.finalFinding.should.be.equal('Unknown');
    });

    it('should return `Unknown` if it\'s not the finding that we known', function () {
      var officerAllegation = f.create('OfficerAllegation', { 'final_finding': 'somethingnotavailable' });
      var presenter = OfficerAllegationPresenter(officerAllegation);

      presenter.finalFinding.should.be.equal('Unknown');
    });

    it('should return the display of the finding code if we know them', function () {
      var officerAllegation = f.create('OfficerAllegation', { 'final_finding': 'un' });
      var presenter = OfficerAllegationPresenter(officerAllegation);

      presenter.finalFinding.should.be.equal('Unfounded');
    });
  });
});
