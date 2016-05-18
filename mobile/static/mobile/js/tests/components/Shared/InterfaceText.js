var InterfaceText, InterfaceTextResourceUtil;

var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

var sinon = require('sinon');
require('should');
require('utils/tests/should/React');

InterfaceText = require('components/Shared/InterfaceText.react');
InterfaceTextResourceUtil = require('utils/InterfaceTextResourceUtil');


describe('InterfaceTextComponent', function () {
  var interfaceText;

  beforeEach(function () {
    sinon.stub(InterfaceTextResourceUtil, 'get', function () {});
  });

  afterEach(function () {
    InterfaceTextResourceUtil.get.restore();
  });

  it('should be renderable', function () {
    InterfaceText.should.be.renderable();
  });

  it('should render the blurred placeholder if the data is not loaded yet', function () {
    var node;
    interfaceText = ReactTestUtils.renderIntoDocument(
      <InterfaceText placeholderLength={ 3 } identifier='key'/>
    );
    interfaceText.setState({
      'loaded': false
    });
    node = ReactTestUtils.findRenderedDOMComponentWithClass(interfaceText, 'interface-text');
    node.getAttribute('class').should.containEql('blur');
    node.textContent.should.eql('xxx');
  });

  it('should render the data if it\'s already loaded', function () {
    var node;
    interfaceText = ReactTestUtils.renderIntoDocument(
      <InterfaceText placeholderLength={ 3 } identifier='key'/>
    );
    interfaceText.setState({
      'interfaceTexts': {
        'key': 'something'
      },
      'loaded': true
    });
    node = ReactTestUtils.findRenderedDOMComponentWithClass(interfaceText, 'interface-text');
    node.getAttribute('class').should.not.containEql('blur');
    node.textContent.should.eql('something');
  });
});
