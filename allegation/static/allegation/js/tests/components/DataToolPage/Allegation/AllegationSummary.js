var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var sinon = require('sinon');
var _ = require('lodash');

var AllegationSummary = require('components/DataToolPage/Allegation/AllegationSummary.react');
var AllegationPresenterFactory = require('presenters/AllegationPresenterFactory');
var RequestModal = require('components/DataToolPage/Complaint/RequestModal.react');
var AppDispatcher = require('dispatcher/AppDispatcher');
var RequestDocumentActions = require('actions/RequestDocumentActions');
var InterfaceTextUtil = require('utils/InterfaceTextUtil');

require('should');
require('utils/tests/should');


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
    investigator: null,
    documents: [
      {
        id: 1,
        type: 'a'
      }
    ]
  };

  afterEach(function () {
    if (AllegationPresenterFactory.buildPresenter.restore) {
      AllegationPresenterFactory.buildPresenter.restore();
    }
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

  // INTEGRATION TESTS BEGIN HERE

  it('should activate document request modal', function () {
    var requestBtn;
    var requestModal;
    var callback;
    var modalContent;
    var emailInput;
    var submitBtn;
    var thankYouMessage = 'Thank you message';
    sinon.stub(RequestDocumentActions, 'registerEmail');
    sinon.stub(InterfaceTextUtil, 'get', function () {
      return thankYouMessage;
    });

    allegationSummary = ReactTestUtils.renderIntoDocument(
      <AllegationSummary allegation={ MOCK_ALLEGATION } noButton={ true }/>
    );
    requestModal = ReactTestUtils.renderIntoDocument(<RequestModal/>);

    requestBtn = ReactTestUtils.findRenderedDOMComponentWithClass(allegationSummary, 'document-action');

    callback = AppDispatcher.getCallback(RequestModal.dispatcherToken);
    ReactTestUtils.Simulate.click(requestBtn);
    callback(AppDispatcher.dispatch.lastCall.args[0]);

    modalContent = ReactTestUtils.findRenderedDOMComponentWithClass(requestModal, 'request-form');
    modalContent.className.split(' ').should.not.containEql('hidden');
    modalContent.textContent.should.contains('We\'ll notify you when the document is made available.');

    emailInput = ReactTestUtils.findRenderedDOMComponentWithTag(requestModal, 'input');
    emailInput.value = 'what@ever.email';
    ReactTestUtils.Simulate.change(emailInput);

    submitBtn = ReactTestUtils.findRenderedDOMComponentWithClass(requestModal, 'btn-primary');
    ReactTestUtils.Simulate.click(submitBtn);

    modalContent = ReactTestUtils.findRenderedDOMComponentWithClass(requestModal, 'thanks-form');
    modalContent.textContent.should.contains(thankYouMessage);

    RequestDocumentActions.registerEmail.calledWith(1, 'what@ever.email').should.be.true();

    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(requestModal).parentNode);
    RequestDocumentActions.registerEmail.restore();
    InterfaceTextUtil.get.restore();
  });
});
