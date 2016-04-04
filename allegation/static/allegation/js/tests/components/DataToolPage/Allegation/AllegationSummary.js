var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var sinon = require('sinon');
var _ = require('lodash');

var AllegationSummary = require('components/DataToolPage/Allegation/AllegationSummary.react');
var AllegationPresenterFactory = require('presenters/AllegationPresenterFactory');

require('should');


describe('AllegationSummary component', function () {
  var allegationSummary;
  var DEFAULT_PRESENTER_RETURNS = {
    crid: '',
    mainCategory: 'Unknown',
    subCategory: '',
    finalOutcome: 'Unknown',
    finalFinding: 'Unknown',
    recFinding: 'Unknown',
    recOutcome: 'Unknown',
    displayRecFinding: false,
    displayRecOutcome: false,
    complainingWitness: [],
    orderedDocuments: []
  };
  var MOCK_ALLEGATION = {
    investigator: null
  };

  afterEach(function () {
    AllegationPresenterFactory.buildPresenter.restore();
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(allegationSummary).parentNode);
  });

  it('displays recommended finding when presenter says so', function () {
    sinon.stub(AllegationPresenterFactory, 'buildPresenter').returns(DEFAULT_PRESENTER_RETURNS);
    allegationSummary = ReactTestUtils.renderIntoDocument(
      <AllegationSummary allegation={ MOCK_ALLEGATION } noButton={ true }/>
    );
    (ReactTestUtils.scryRenderedDOMComponentsWithClass(allegationSummary, 'rec-finding').length).should.be.equal(0);
  });

  it('hide recommended finding when presenter says so', function () {
    sinon.stub(AllegationPresenterFactory, 'buildPresenter')
      .returns(_.assign(DEFAULT_PRESENTER_RETURNS, { 'displayRecFinding': true }));
    allegationSummary = ReactTestUtils.renderIntoDocument(
      <AllegationSummary allegation={ MOCK_ALLEGATION } noButton={ true }/>
    );
    (ReactTestUtils.scryRenderedDOMComponentsWithClass(allegationSummary, 'rec-finding').length).should.be.equal(1);
  });

  it('displays recommended outcome when presenter says so', function () {
    sinon.stub(AllegationPresenterFactory, 'buildPresenter').returns(DEFAULT_PRESENTER_RETURNS);
    allegationSummary = ReactTestUtils.renderIntoDocument(
      <AllegationSummary allegation={ MOCK_ALLEGATION } noButton={ true }/>
    );
    (ReactTestUtils.scryRenderedDOMComponentsWithClass(allegationSummary, 'rec-outcome').length).should.be.equal(0);
  });

  it('hide recommended outcome when presenter says so', function () {
    sinon.stub(AllegationPresenterFactory, 'buildPresenter')
      .returns(_.assign(DEFAULT_PRESENTER_RETURNS, { 'displayRecOutcome': true }));
    allegationSummary = ReactTestUtils.renderIntoDocument(
      <AllegationSummary allegation={ MOCK_ALLEGATION } noButton={ true }/>
    );
    (ReactTestUtils.scryRenderedDOMComponentsWithClass(allegationSummary, 'rec-outcome').length).should.be.equal(1);
  });
});
