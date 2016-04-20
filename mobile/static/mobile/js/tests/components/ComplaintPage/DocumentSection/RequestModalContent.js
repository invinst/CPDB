var RequestModalContent, Modal, RequestActions;

var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ReactStubContext = require('react-stub-context');
var sinon = require('sinon');

require('should');

require('utils/tests/should/React');

RequestModalContent = require('components/ComplaintPage/DocumentSection/DocumentCard/RequestModalContent.react');
RequestActions = require('actions/ComplaintPage/RequestActions');
Modal = require('components/Lib/Modal.react');


describe('RequestModalContentComponent', function () {
  it('should be renderable', function () {
    RequestModalContent.should.be.renderable();
  });

  it('should close the modal when clicking close icon', function () {
    var requestModal, closeBtn, RequestModalContentStub;
    var context = {'modalName': 'requestModal'};
    var mock = sinon.mock(Modal.eventSystem);
    mock.expects('dispatch').once().withArgs('requestModal', 'close');

    RequestModalContentStub = ReactStubContext(RequestModalContent, context);

    requestModal = ReactTestUtils.renderIntoDocument(
      <RequestModalContentStub />
    );

    closeBtn = ReactTestUtils.findRenderedDOMComponentWithClass(requestModal, 'icon-close');
    ReactTestUtils.Simulate.click(closeBtn);

    mock.verify();
    mock.restore();
  });

  it('should close the modal when clicking cancel button', function () {
    var requestModal, cancelBtn, RequestModalContentStub;
    var context = {'modalName': 'requestModal'};
    var mock = sinon.mock(Modal.eventSystem);
    mock.expects('dispatch').once().withArgs('requestModal', 'close');

    RequestModalContentStub = ReactStubContext(RequestModalContent, context);

    requestModal = ReactTestUtils.renderIntoDocument(
      <RequestModalContentStub />
    );

    cancelBtn = ReactTestUtils.findRenderedDOMComponentWithClass(requestModal, 'btn-cancel');
    ReactTestUtils.Simulate.click(cancelBtn);

    mock.verify();
    mock.restore();
  });

  it('should send register email action when clicking submit button', function () {
    var requestModal, submitBtn;
    var mock = sinon.mock(RequestActions);
    mock.expects('registerEmail').once();

    requestModal = ReactTestUtils.renderIntoDocument(
      <RequestModalContent/>
    );
    submitBtn = ReactTestUtils.findRenderedDOMComponentWithClass(requestModal, 'btn-submit');
    ReactTestUtils.Simulate.click(submitBtn);

    mock.verify();
    mock.restore();
  });

  it('should render `hide` style for request form if requested state is true', function () {
    var requestForm;
    var requestModal = ReactTestUtils.renderIntoDocument(
      <RequestModalContent/>
    );
    requestModal.setState({'requested': true});

    requestForm = ReactTestUtils.findRenderedDOMComponentWithClass(requestModal, 'request-form');
    requestForm.getAttribute('class').should.containEql('hide');
  });

  it('should render `hide` style for `thank-you` if requested state is false', function () {
    var thankYouNode;
    var requestModal = ReactTestUtils.renderIntoDocument(
      <RequestModalContent/>
    );
    requestModal.setState({'requested': false});

    thankYouNode = ReactTestUtils.findRenderedDOMComponentWithClass(requestModal, 'thank-you');
    thankYouNode.getAttribute('class').should.containEql('hide');
  });
});
