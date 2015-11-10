"use strict";

jest.autoMockOff();

describe('ComplaintList', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var complaints;
  var ComplaintListStore = require('stores/ComplaintListStore');
  var ComplaintSection = require('../ComplaintSection.react');

  it('should exists', function () {
    complaints = TestUtils.renderIntoDocument(
      <ComplaintSection />
    );
    expect(TestUtils.isCompositeComponent(complaints)).toBeTruthy();
  });

  it('render nothing when do not have any complaints', function () {
    ComplaintListStore.getState = jest.genMockFunction();
    ComplaintListStore.getState.mockReturnValue({complaints: [], loading: false, analytics: {}});
    complaints = TestUtils.renderIntoDocument(
      <ComplaintSection />
    );
    var div = TestUtils.findRenderedDOMComponentWithClass(complaints, 'no-complaints');
    expect(div.props.children).toBe('No allegations match the query.');
  });
});
