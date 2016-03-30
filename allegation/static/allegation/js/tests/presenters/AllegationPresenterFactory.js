var _ = require('lodash');

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
    var doc1 = { documentcloud_id: 1, type: 'CR' };
    var doc2 = { documentcloud_id: 1, type: 'CPB' };

    var presenter = AllegationPresenterFactory.buildPresenter(
      _.merge(ALLEGATION_MOCK, {'documents': [doc2, doc1]}));
    presenter.orderedDocuments[0].type.should.equal('CR');
    presenter.orderedDocuments[1].type.should.equal('CPB');

    presenter = AllegationPresenterFactory.buildPresenter(
      _.merge(ALLEGATION_MOCK, {'documents': [doc1, doc2]}));
    presenter.orderedDocuments[0].type.should.equal('CR');
    presenter.orderedDocuments[1].type.should.equal('CPB');
  });

  it('returns document types string', function () {
    var doc1 = { documentcloud_id: 1, type: 'CR' };
    var doc2 = { documentcloud_id: 0, type: 'CPB' };

    var presenter = AllegationPresenterFactory.buildPresenter(
      _.merge(ALLEGATION_MOCK, {'documents': [doc2, doc1]}));
    presenter.documentTypes.should.equal('CR');

    presenter = AllegationPresenterFactory.buildPresenter(
      _.merge(ALLEGATION_MOCK, {'documents': [doc1, doc2]}));
    presenter.documentTypes.should.equal('CR');
  });
});
