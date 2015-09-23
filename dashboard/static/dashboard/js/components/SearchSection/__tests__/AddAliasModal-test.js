"use strict";

jest.autoMockOff();


describe('AddAliasModal', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var AddAliasModal = require('../AddAliasModal.react');
  var addAliasModal;

  beforeEach(function() {
    addAliasModal = TestUtils.renderIntoDocument(
        <AddAliasModal />
    );
  });

  it('should exists', function () {
    expect(TestUtils.isCompositeComponent(addAliasModal)).toBeTruthy();
  });

  it('should show on open state', function() {
    addAliasModal.setState({ isOpen: true });
    var div = TestUtils.findRenderedDOMComponentWithClass(addAliasModal, 'modal');
    expect(React.findDOMNode(div).className).toContain('in');
  });

  it('should not show on close state', function() {
    addAliasModal.setState({ isOpen: false });
    var div = TestUtils.findRenderedDOMComponentWithClass(addAliasModal, 'modal');
    expect(React.findDOMNode(div).className).not.toContain('in');
  });

  it('should check if it is a valid form or not', function() {
    addAliasModal.setState({ isOpen: true });
    var div = TestUtils.findRenderedDOMComponentWithClass(addAliasModal, 'modal');
    var aliasInput = TestUtils.findRenderedDOMComponentWithClass(addAliasModal, 'alias-input');
    var targetInput = TestUtils.findRenderedDOMComponentWithClass(addAliasModal, 'target-input');
    var btnSubmit = TestUtils.findRenderedDOMComponentWithClass(addAliasModal, 'btn-submit').getDOMNode();
    expect(btnSubmit.hasAttribute('disabled')).toBe(true);
    TestUtils.Simulate.change(aliasInput, { target: { value: 'value'}});
    expect(btnSubmit.hasAttribute('disabled')).toBe(true);
    TestUtils.Simulate.change(targetInput, { target: { value: 'test'}});
    expect(btnSubmit.hasAttribute('disabled')).toBe(false);
  });
});
