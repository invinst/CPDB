var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var Modal = require('react-modal');

var UploadDocumentModal = require('components/DocumentSection/UploadDocumentModal.react');

require('should');


describe('UploadDocumentModal component', function () {
  var component;

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(component).parentNode);
  });

  it('should disable submit button', function () {
    var submitBtn;
    var modal;

    component = ReactTestUtils.renderIntoDocument(
      <UploadDocumentModal isOpen={ true }/>
    );
    modal = ReactTestUtils.findRenderedComponentWithType(component, Modal);

    submitBtn = ReactTestUtils.findRenderedDOMComponentWithClass(modal.portal, 'btn-primary');
    submitBtn.hasAttribute('disabled').should.be.true();
  });

  it('should enable submit button when user fill all required information', function () {
    var submitBtn;
    var modal;
    var titleInput;
    var sourceInput;
    var listInput;
    var dropzoneContent;
    var files = [{
      name: 'test.pdf',
      size: 1111
    }];

    component = ReactTestUtils.renderIntoDocument(
      <UploadDocumentModal isOpen={ true }/>
    );
    modal = ReactTestUtils.findRenderedComponentWithType(component, Modal);
    listInput = ReactTestUtils.scryRenderedDOMComponentsWithTag(modal.portal, 'input');

    submitBtn = ReactTestUtils.findRenderedDOMComponentWithClass(modal.portal, 'btn-primary');

    // file upload is required
    dropzoneContent = ReactTestUtils.findRenderedDOMComponentWithClass(modal.portal, 'dropzone-content');
    ReactTestUtils.Simulate.drop(dropzoneContent, { dataTransfer: { files: files } });

    // title is required
    titleInput = listInput[1];
    titleInput.value = 'title';
    ReactTestUtils.Simulate.change(titleInput);

    submitBtn.hasAttribute('disabled').should.be.false();

    // source is not required
    sourceInput = listInput[2];
    sourceInput.value = 'source';
    ReactTestUtils.Simulate.change(sourceInput);

    submitBtn.hasAttribute('disabled').should.be.false();
  });

  it('should request close when click on cancel', function () {
    var modal;
    var cancelBtn;
    var requested = false;
    var requestClose = function () {
      requested = true;
    };

    component = ReactTestUtils.renderIntoDocument(
      <UploadDocumentModal isOpen={ true } onRequestClose={ requestClose }/>
    );
    modal = ReactTestUtils.findRenderedComponentWithType(component, Modal);
    cancelBtn = ReactTestUtils.findRenderedDOMComponentWithClass(modal.portal, 'btn-cancel');

    requested.should.be.false();
    ReactTestUtils.Simulate.click(cancelBtn);
    requested.should.be.true();
  });
});

