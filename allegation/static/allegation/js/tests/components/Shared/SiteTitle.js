var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var sinon = require('sinon');

var SessionStore = require('stores/SessionStore');
var SiteTitleStore = require('stores/SiteTitleStore');
var FilterTagStore = require('stores/FilterTagStore');
var ShareButtonStore = require('stores/DataToolPage/ShareButtonStore');
var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var SiteTitle = require('components/Shared/SiteTitle.react');
var ShareButton = require('components/DataToolPage/Share/ShareButton.react');
var locationUtils = require('utils/location');

require('should');


describe('SiteTitle component', function () {
  var siteTitle;

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(siteTitle).parentNode);
  });

  it('is editable when `changable` is true', function () {
    var node;

    siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle changable={ true } />
    );
    node = ReactTestUtils.findRenderedDOMComponentWithTag(siteTitle, 'input');

    (node.hasAttribute('disabled')).should.not.be.true();
  });

  it('is not editable when `changable` is false', function () {
    var node;

    siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle changable={ false } />
    );
    node = ReactTestUtils.findRenderedDOMComponentWithTag(siteTitle, 'input');

    (node.hasAttribute('disabled')).should.be.true();
  });

  it('shows siteTitle from SessionStore initiallly', function () {
    var title = 'beep boop', node;

    SessionStore.updateState('siteTitle', title);
    siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle/>
    );
    node = ReactTestUtils.findRenderedDOMComponentWithTag(siteTitle, 'input');

    (node.value).should.equal(title);
  });

  it('updates siteTitle from SiteTitleStore', function () {
    var node, title = 'freed from desire';

    siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle/>
    );
    node = ReactTestUtils.findRenderedDOMComponentWithTag(siteTitle, 'input');

    SiteTitleStore.updateState('siteTitle', title);
    SiteTitleStore.emitChange();

    (node.value).should.equal(title);
  });

  it('emits changeSiteTitle action when editted', function () {
    var node;

    SessionStore.updateState('siteTitle', 'Lothric');
    siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle/>
    );
    node = ReactTestUtils.findRenderedDOMComponentWithTag(siteTitle, 'input');
    node.value = 'giraffe';
    ReactTestUtils.Simulate.change(node);

    (AppDispatcher.dispatch.calledWithMatch({
      actionType: AppConstants.CHANGE_SITE_TITLE,
      title: 'giraffe'
    })).should.be.true();
  });

  it('shows dotted underline when share bar active and there are filters', function () {
    siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle/>
    );

    ShareButtonStore.updateState('active', true);
    ShareButtonStore.emitChange();
    FilterTagStore.updateState('filters', {key: 'val'});
    FilterTagStore.emitChange();

    (ReactTestUtils.scryRenderedDOMComponentsWithClass(siteTitle, 'after-title-input').length).should.be.equal(1);
  });

  it('does not show dotted underline otherwise', function () {
    siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle/>
    );

    ShareButtonStore.updateState('active', false);
    ShareButtonStore.emitChange();
    FilterTagStore.updateState('filters', {key: 'val'});
    FilterTagStore.emitChange();

    (ReactTestUtils.scryRenderedDOMComponentsWithClass(siteTitle, 'after-title-input').length).should.be.equal(0);

    ShareButtonStore.updateState('active', true);
    ShareButtonStore.emitChange();
    FilterTagStore.updateState('filters', {});
    FilterTagStore.emitChange();

    (ReactTestUtils.scryRenderedDOMComponentsWithClass(siteTitle, 'after-title-input').length).should.be.equal(0);
  });

  it('changes shared url when change site title', function () {
    var siteTitleNode;
    var shareButton = ReactTestUtils.renderIntoDocument(
      <ShareButton/>
    );
    var shareBarInputNode;
    var ShareButtonStoreCallback = AppDispatcher.getCallback(ShareButtonStore.dispatcherIndex);

    siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle/>
    );
    siteTitleNode = ReactTestUtils.findRenderedDOMComponentWithTag(siteTitle, 'input');

    ShareButtonStore.updateState('active', true);
    ShareButtonStore.updateState('sharedSessionHashId', 'abcdef');
    sinon.stub(locationUtils, 'getWindowHref').returns('host/data/abcdef/slug');
    ShareButtonStore.emitChange();

    // change site title
    siteTitleNode.value = 'Doom Hammer';
    ReactTestUtils.Simulate.change(siteTitleNode);

    // manual wiring cause AppDispatcher is stubbed
    ShareButtonStoreCallback(AppDispatcher.dispatch.lastCall.args[0]);

    // check that shared url is updated with expected value
    shareBarInputNode = ReactTestUtils.findRenderedDOMComponentWithTag(shareButton, 'input');
    (shareBarInputNode.value).should.be.equal('host/data/abcdef/doom-hammer');

    locationUtils.getWindowHref.restore();
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(shareButton).parentNode);
  });
});
