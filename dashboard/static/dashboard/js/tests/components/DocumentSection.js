var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var Modal = require('react-modal');

var DocumentSection = require('components/DocumentSection.react');

require('should');


describe('DocumentSection component', function () {
  var component;

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(component).parentNode);
  });

  it('should open and close upload modal', function (done) {
    var uploadBtn;
    var cancelBtn;
    var modal;

    component = ReactTestUtils.renderIntoDocument(
      <DocumentSection params={ {id: '1234'} }/>
    );
    modal = ReactTestUtils.findRenderedComponentWithType(component, Modal);

    uploadBtn = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'btn-upload-document');
    ReactTestUtils.Simulate.click(uploadBtn);

    ReactTestUtils.scryRenderedDOMComponentsWithClass(modal.portal, 'ReactModal__Content').length.should.equal(1);

    cancelBtn = ReactTestUtils.findRenderedDOMComponentWithClass(modal.portal, 'btn-cancel');
    ReactTestUtils.Simulate.click(cancelBtn);

    setTimeout(function () {
      ReactTestUtils.scryRenderedDOMComponentsWithClass(modal.portal, 'ReactModal__Content').length.should.equal(0);
      done();
    }, 150);

  });
});
