var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ReactDOM = require('react-dom');

var Nav = require('components/Shared/Nav2.react');

require('should');


describe('Nav component', function () {
  var nav;

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(nav).parentNode);
  });

  it('displays share button when data page is active', function () {
    var isActive = function (page) {
      if (page === 'data') {
        return true;
      }
      return false;
    };

    nav = ReactTestUtils.renderIntoDocument(
      <Nav isActive={ isActive } />
    );
    (ReactTestUtils.scryRenderedDOMComponentsWithClass(nav, 'share-button').length).should.be.equal(1);

    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(nav).parentNode);
    nav = ReactTestUtils.renderIntoDocument(
      <Nav isActive={ function () { return false; } } />
    );
    (ReactTestUtils.scryRenderedDOMComponentsWithClass(nav, 'share-button').length).should.be.equal(0);
  });
});
