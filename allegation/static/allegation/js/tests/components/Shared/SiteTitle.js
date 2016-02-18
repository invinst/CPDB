var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var SessionStore = require('stores/SessionStore');
var SiteTitleStore = require('stores/SiteTitleStore');
var FilterTagStore = require('stores/FilterTagStore');
var ShareButtonStore = require('stores/DataToolPage/ShareButtonStore');
var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var SiteTitle = require('components/Shared/SiteTitle.react');

require('should');


describe('SiteTitle component', function () {
  it('is editable when `changable` is true', function () {
    var siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle changable={ true } />
    );
    var node = ReactDOM.findDOMNode(siteTitle);

    (node.hasAttribute('disabled')).should.not.be.true();
  });

  it('is not editable when `changable` is false', function () {
    var siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle changable={ false } />
    );
    var node = ReactDOM.findDOMNode(siteTitle);

    (node.hasAttribute('disabled')).should.be.true();
  });

  it('shows siteTitle from SessionStore initiallly', function () {
    var title = 'beep boop', siteTitle, node;

    SessionStore.updateState('siteTitle', title);
    siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle/>
    );
    node = ReactDOM.findDOMNode(siteTitle);

    (node.value).should.equal(title);
  });

  it('updates siteTitle from SiteTitleStore', function () {
    var siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle/>
    );
    var node = ReactDOM.findDOMNode(siteTitle);
    var title = 'freed from desire';

    SiteTitleStore.updateState('siteTitle', title);
    SiteTitleStore.emitChange();

    (node.value).should.equal(title);
  });

  it('emits changeSiteTitle action when editted', function () {
    var siteTitle, node;

    SessionStore.updateState('siteTitle', 'Lothric');
    siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle/>
    );
    node = ReactDOM.findDOMNode(siteTitle);
    node.value = 'giraffe';
    ReactTestUtils.Simulate.change(node);

    (AppDispatcher.dispatch.calledWithMatch({
      actionType: AppConstants.CHANGE_SITE_TITLE,
      title: 'giraffe'
    })).should.be.true();
  });

  it('shows dotted underline when share bar active and there are filters', function () {
    var siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle/>
    );
    var node = ReactDOM.findDOMNode(siteTitle);

    ShareButtonStore.setActive(true);
    ShareButtonStore.emitChange();
    FilterTagStore.updateState('filters', {key: 'val'});
    FilterTagStore.emitChange();

    (node.className).should.containEql('dashed-border');
  });

  it('does not show dotted underline otherwise', function () {
    var siteTitle = ReactTestUtils.renderIntoDocument(
      <SiteTitle/>
    );
    var node = ReactDOM.findDOMNode(siteTitle);

    ShareButtonStore.setActive(false);
    ShareButtonStore.emitChange();
    FilterTagStore.updateState('filters', {key: 'val'});
    FilterTagStore.emitChange();

    (node.className).should.not.containEql('dashed-border');

    ShareButtonStore.setActive(true);
    ShareButtonStore.emitChange();
    FilterTagStore.updateState('filters', {});
    FilterTagStore.emitChange();

    (node.className).should.not.containEql('dashed-border');
  });
});
