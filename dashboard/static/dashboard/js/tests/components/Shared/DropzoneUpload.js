var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var Formsy = require('formsy-react');

var DropzoneUpload = require('components/Shared/DropzoneUpload.react');

require('should');


describe('DropzoneUpload component', function () {
  var formsyForm;
  var file = {
    name: 'test.pdf',
    size: 1111
  };

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(formsyForm).parentNode);
  });

  it('should accept dropping file', function () {
    var dropzoneContent;
    var dropzone;

    formsyForm = ReactTestUtils.renderIntoDocument(
      <Formsy.Form >
        <DropzoneUpload name='abc'/>
      </Formsy.Form>
    );

    dropzoneContent = ReactTestUtils.findRenderedDOMComponentWithClass(formsyForm, 'dropzone-content');
    ReactTestUtils.Simulate.drop(dropzoneContent, { dataTransfer: { files: [file] } });

    dropzone = ReactTestUtils.findRenderedComponentWithType(formsyForm, DropzoneUpload);
    dropzone.getValue().should.equal(file);
  });

});
