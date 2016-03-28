var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var Formsy = require('formsy-react');

var BootstrapTextInput = require('components/Shared/BootstrapTextInput.react');

require('should');


describe('BootstrapTextInput component', function () {
  var formsyForm;

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(formsyForm).parentNode);
  });

  it('should change value when user type in', function () {
    var bootstrapTextInput;
    var input;

    formsyForm = ReactTestUtils.renderIntoDocument(
      <Formsy.Form >
        <BootstrapTextInput name='whatever'/>
      </Formsy.Form>
    );

    bootstrapTextInput = ReactTestUtils.findRenderedComponentWithType(formsyForm, BootstrapTextInput);
    input = ReactTestUtils.findRenderedDOMComponentWithClass(bootstrapTextInput, 'form-control');

    input.value = 'abc';
    ReactTestUtils.Simulate.change(input);

    bootstrapTextInput.getValue().should.equal('abc');
  });

  it('should have errors if not filled', function () {
    var bootstrapTextInput;
    var input;

    formsyForm = ReactTestUtils.renderIntoDocument(
      <Formsy.Form >
        <BootstrapTextInput name='cde' required={ true }/>
      </Formsy.Form>
    );

    bootstrapTextInput = ReactTestUtils.findRenderedComponentWithType(formsyForm, BootstrapTextInput);
    input = ReactTestUtils.findRenderedDOMComponentWithClass(bootstrapTextInput, 'form-control');

    input.value = '';
    ReactTestUtils.Simulate.change(input);

    ReactDOM.findDOMNode(bootstrapTextInput).className.indexOf('has-error').should.not.equal(-1);
  });
});
