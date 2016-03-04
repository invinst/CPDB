var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var sinon = require('sinon');

var ShareBar = require('components/DataToolPage/Share/ShareBar.react');
var ShareBarActions = require('actions/ShareBarActions');
var SiteTitleStore = require('stores/SiteTitleStore');

require('should');


describe('ShareBar component', function () {
  var shareBar;

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(shareBar).parentNode);
  });

  it('updates tweet intent href when siteTitle change', function () {
    var TwitterLinkNode;

    SiteTitleStore.updateState('siteTitle', 'Drangleic');

    shareBar = ReactTestUtils.renderIntoDocument(
      <ShareBar sharedUrl='abcd'/>
    );
    TwitterLinkNode = ReactTestUtils.scryRenderedDOMComponentsWithTag(shareBar, 'a')[1];

    (TwitterLinkNode.href).should.be.equal('https://twitter.com/intent/tweet?text=Drangleic&url=abcd');

    SiteTitleStore.updateState('siteTitle', 'Tree');
    SiteTitleStore.emitChange();

    (TwitterLinkNode.href).should.be.equal('https://twitter.com/intent/tweet?text=Tree&url=abcd');
  });

  // TODO: should write this test: "click on url input will select all of it's text"
  // but phantomjs doesn't support anyway to check text selection

  it('share to fb when click on facebook icon', function () {
    var FBLinkNode;

    sinon.stub(ShareBarActions, 'shareToFB');

    SiteTitleStore.updateState('siteTitle', 'bird');
    shareBar = ReactTestUtils.renderIntoDocument(
      <ShareBar sharedUrl='cats' sharedSessionHashId='dogs'/>
    );
    FBLinkNode = ReactTestUtils.scryRenderedDOMComponentsWithTag(shareBar, 'a')[0];

    ReactTestUtils.Simulate.click(FBLinkNode);

    (ShareBarActions.shareToFB.calledWith('dogs', 'bird', 'cats')).should.be.true();
    ShareBarActions.shareToFB.restore();
  });
});
