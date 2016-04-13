var _ = require('lodash');
var f = require('utils/tests/f');

var AllegationPresenterFactory = require('presenters/AllegationPresenterFactory');

require('should');


describe('AllegationPresenterFactory', function () {
  var ALLEGATION_MOCK = {
    'officer_allegation': {
      'final_outcome': 'Unknown',
      'final_finding': 'Unknown',
      'recc_outcome': 'Unknown',
      'recc_finding': 'Unknown'
    }
  };

  it('does not display rec finding when is unknown', function () {
    AllegationPresenterFactory.buildPresenter(ALLEGATION_MOCK).displayRecFinding.should.be.false();
    AllegationPresenterFactory.buildPresenter(_.merge(ALLEGATION_MOCK, {'officer_allegation': {'recc_finding': null}}))
      .displayRecFinding.should.be.false();
    AllegationPresenterFactory.buildPresenter(_.merge(ALLEGATION_MOCK, {'officer_allegation': {'recc_finding': ''}}))
      .displayRecFinding.should.be.false();
    AllegationPresenterFactory.buildPresenter(
      _.merge(ALLEGATION_MOCK, {'officer_allegation': {'recc_finding': undefined}})
    ).displayRecFinding.should.be.false();
  });

  it('display rec finding when is different', function () {
    var presenter = AllegationPresenterFactory.buildPresenter(
      _.merge(ALLEGATION_MOCK, {'officer_allegation': {'recc_finding': 'abc'}})
    );
    presenter.displayRecFinding.should.be.true();
    presenter.recFinding.should.equal('abc');
  });

  it('does not display rec finding when is the same as final finding', function () {
    var presenter = AllegationPresenterFactory.buildPresenter(
      _.merge(ALLEGATION_MOCK, {'officer_allegation': {'recc_finding': 'abc', 'final_finding': 'abc'}})
    );
    presenter.displayRecFinding.should.be.false();
  });

  it('does not display rec outcome when is unknown', function () {
    AllegationPresenterFactory.buildPresenter(ALLEGATION_MOCK).displayRecOutcome.should.be.false();
    AllegationPresenterFactory.buildPresenter(_.merge(ALLEGATION_MOCK, {'officer_allegation': {'recc_outcome': null}}))
      .displayRecOutcome.should.be.false();
    AllegationPresenterFactory.buildPresenter(_.merge(ALLEGATION_MOCK, {'officer_allegation': {'recc_outcome': ''}}))
      .displayRecOutcome.should.be.false();
    AllegationPresenterFactory.buildPresenter(
      _.merge(ALLEGATION_MOCK, {'officer_allegation': {'recc_outcome': undefined}})
    ).displayRecOutcome.should.be.false();
  });

  it('display rec outcome when is different', function () {
    var presenter = AllegationPresenterFactory.buildPresenter(
      _.merge(ALLEGATION_MOCK, {'officer_allegation': {'recc_outcome': 'abc'}})
    );
    presenter.displayRecOutcome.should.be.true();
    presenter.recOutcome.should.equal('abc');
  });

  it('does not display rec outcome when is the same as final outcome', function () {
    var presenter = AllegationPresenterFactory.buildPresenter(
      _.merge(ALLEGATION_MOCK, {'officer_allegation': {'recc_outcome': 'abc', 'final_outcome': 'abc'}})
    );
    presenter.displayRecOutcome.should.be.false();
  });

  it('returns ordered documents list', function () {
    var doc1 = f.create('Document', { 'documentcloud_id': 1, type: 'CR' });
    var doc2 = f.create('Document', { 'documentcloud_id': 1, type: 'CPB' });

    var presenter = AllegationPresenterFactory.buildPresenter(f.create('Complaint', { 'documents': [doc2, doc1] }));
    presenter.orderedDocuments[0].type.should.equal('CR');
    presenter.orderedDocuments[1].type.should.equal('CPB');

    presenter = AllegationPresenterFactory.buildPresenter(f.create('Complaint', {'documents': [doc1, doc2]}));
    presenter.orderedDocuments[0].type.should.equal('CR');
    presenter.orderedDocuments[1].type.should.equal('CPB');
  });

  it('returns document types string', function () {
    var doc1 = { 'documentcloud_id': 1, type: 'CR' };
    var doc2 = { 'documentcloud_id': 0, type: 'CPB' };

    var presenter = AllegationPresenterFactory.buildPresenter(f.create('Complaint', {'documents': [doc2, doc1]}));
    presenter.documentTypes.should.equal('CR');

    presenter = AllegationPresenterFactory.buildPresenter(f.create('Complaint', {'documents': [doc1, doc2]}));
    presenter.documentTypes.should.equal('CR');
  });

  describe('#incidentDateLabel', function () {
    it('returns investigation start date when have no incident date', function () {
      var allegation = f.create('Complaint', {'officer_allegation': {'start_date': '1970-1-1'}});

      var presenter = AllegationPresenterFactory.buildPresenter(allegation);
      presenter.incidentDateLabel.should.equal('Investigation Start');
    });

    it('returns investigation start date when incident date is in 1970', function () {
      var allegation = f.create('Complaint', {
        'officer_allegation': {'start_date': '1970-1-1'},
        'allegation': {'incident_date': '1970-01-01 00:00:00'}
      });

      var presenter = AllegationPresenterFactory.buildPresenter(allegation);
      presenter.incidentDateLabel.should.equal('Investigation Start');
    });

    it('returns incident date when incident date is valid', function () {
      var allegation = f.create('Complaint', {
        'allegation': {'incident_date': '1971-1-1'}
      });

      var presenter = AllegationPresenterFactory.buildPresenter(allegation);
      presenter.incidentDateLabel.should.equal('Incident Date');
    });
  });

  describe('#incidentDate', function () {
    it('returns investigation start date when not using incident date', function () {
      var allegation = f.create('Complaint', {'officer_allegation': {'start_date': '1970-01-01'}});

      var presenter = AllegationPresenterFactory.buildPresenter(allegation);
      presenter.incidentDate.should.equal('1970-01-01');
    });

    it('returns incident date only when using incident date', function () {
      var allegation = f.create('Complaint', {
        'allegation': {'incident_date': '1971-01-01 00:00:00', 'incident_date_only': '1971-01-01'}
      });

      var presenter = AllegationPresenterFactory.buildPresenter(allegation);
      presenter.incidentDate.should.equal('1971-01-01');
    });
  });

  describe('#officerName', function () {
    it('returns 1 officer name', function () {
      var presenter = AllegationPresenterFactory.buildPresenter(f.create('Complaint',
        {'officer': {'officer_first': 'First', 'officer_last': 'Last'}})
      );
      presenter.officerName.should.equal('First Last');
    });

    it('returns multiple officer names', function () {
      var presenter = AllegationPresenterFactory.buildPresenter(f.create('Complaint',
        {
          'officer': {'officer_first': 'First', 'officer_last': 'Last'},
          'officers': [{'officer_first': 'First', 'officer_last': 'Last'}]
        })
      );
      presenter.officerName.should.equal('First Last and 1 more');
    });
  });
});
