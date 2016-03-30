var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var should = require('should');

var u = require('utils/HelperUtil');


should.Assertion.add('renderable', function () {
  var element = ReactTestUtils.renderIntoDocument(React.createElement(this.obj));

  element.should.be.ok();

  ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(element).parentNode);
});


should.Assertion.add('render', function (components) {
  var i, component, componentDisplayName, failedMessage;
  for (i = 0; i < components.length; i++) {
    component = components[i];
    componentDisplayName = component.displayName;

    failedMessage = u.format('{component} is not rendered', {'component': componentDisplayName});

    ReactTestUtils.scryRenderedComponentsWithType(this.obj, component).length
      .should.be.above(0, failedMessage);
  }
});

should.Assertion.add('renderNothing', function () {
  ReactDOM.findDOMNode(this.obj).textContent.trim().should.be.eql('');
});

should.Assertion.add('renderWithProps', function (component, props) {
  var componentProps, currentPropValue, prop, failedMessage;
  var renderedComponent = ReactTestUtils.findRenderedComponentWithType(this.obj, component);

  for (prop in props) {
    failedMessage = u.format('Prop {prop} got unexpected values', {'prop': prop});
    componentProps = u.fetch(renderedComponent, 'props', {});
    currentPropValue = u.fetch(componentProps, prop, null);
    should(currentPropValue).be.eql(props[prop], failedMessage);
  }
});
