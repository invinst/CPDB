var Modal, sinon;

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

require('should');
sinon = require('sinon');

require('utils/tests/should/React');

Modal = require('components/Lib/Modal.react');


describe('Modal', function () {
  it('should render empty if open state is false', function () {
    var modal = ReactTestUtils.renderIntoDocument(
      <Modal />
    );

    modal.setState({'open': 0});

    modal.should.renderNothing();
  });

  it('should render its children if open state is true', function () {
    var modal = ReactTestUtils.renderIntoDocument(
      <Modal>children</Modal>
    );

    modal.setState({'open': 1});

    ReactDOM.findDOMNode(modal).textContent.should.be.eql('children');
  });

  describe('#dispatch', function () {
    it('should call event system dispatch', function () {
      var mock = sinon.mock(Modal.eventSystem);
      mock.expects('dispatch').once().withArgs('target', 'event');

      Modal.dispatch('target', 'event')();

      mock.verify();
      mock.restore();
    });
  });
});
