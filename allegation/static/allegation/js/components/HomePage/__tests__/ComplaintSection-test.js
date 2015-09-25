"use strict";

jest.autoMockOff();

describe('ComplaintList', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var complaints;
  var ComplaintListStore = require('../../stores/ComplaintListStore');
  var ComplaintSection = require('../ComplaintSection.react');

  it('should exists', function () {
    complaints = TestUtils.renderIntoDocument(
      <ComplaintSection />
    );
    expect(TestUtils.isCompositeComponent(complaints)).toBeTruthy();
  });

  it('render nothing when do not have any complaints', function () {
    ComplaintListStore.getState = jest.genMockFunction();
    ComplaintListStore.getState.mockReturnValue({'complaints': [], 'loading': false});
    complaints = TestUtils.renderIntoDocument(
      <ComplaintSection />
    );
    var divs = TestUtils.scryRenderedDOMComponentsWithTag(complaints, 'div');
    expect(divs.length).toBe(1);
  });
});
