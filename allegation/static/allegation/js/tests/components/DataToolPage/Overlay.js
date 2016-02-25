var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var sinon = require('sinon');

var Overlay = require('components/DataToolPage/Overlay.react');
var OverlayStore = require('stores/DataToolPage/OverlayStore');

require('should');


describe('Overlay component', function () {
  var overlay;

  afterEach(function () {
    if (OverlayStore.getState.restore) {
      OverlayStore.getState.restore();
    }

    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(overlay).parentNode);
  });

  it('should deactive at initial state', function () {
    overlay = ReactTestUtils.renderIntoDocument(
      <Overlay />
    );

    ReactTestUtils.scryRenderedDOMComponentsWithClass(overlay, 'active').length.should.be.equal(0);
  });

  it('active/deactive overlay when store say so', function () {
    sinon.stub(OverlayStore, 'getState', function () {
      return {
        active: true
      };
    });

    overlay = ReactTestUtils.renderIntoDocument(
      <Overlay />
    );

    OverlayStore.emitChange();

    ReactTestUtils.scryRenderedDOMComponentsWithClass(overlay, 'active').length.should.be.equal(1);
  });

  it('deactive overlay when store say so', function () {
    sinon.stub(OverlayStore, 'getState', function () {
      return {
        active: false
      };
    });

    overlay = ReactTestUtils.renderIntoDocument(
      <Overlay />
    );

    OverlayStore.emitChange();

    ReactTestUtils.scryRenderedDOMComponentsWithClass(overlay, 'active').length.should.be.equal(0);
  });
});
