var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var sinon = require('sinon');

var InterfaceText = require('components/Shared/InterfaceText.react');
var InterfaceTextUtil = require('utils/InterfaceTextUtil');

require('should');


describe('InterfaceTextComponent', function () {
  var interfaceText;

  it('should show the interface text with corresponding identifier', function () {
    var identifier = 'identifer';
    var text = 'something';
    sinon.stub(InterfaceTextUtil, 'get', function () { return text; });

    interfaceText = ReactTestUtils.renderIntoDocument(
      <InterfaceText identifier={ identifier } />
    );

    ReactDOM.findDOMNode(interfaceText).textContent.should.be.eql(text);

    InterfaceTextUtil.get.restore();
  });
});
