"use strict";

jest.autoMockOff();

describe('LoadingComplaintList', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var loading;

  beforeEach(function () {
    var LoadingComplaintList = require('../LoadingComplaintList.react');
    loading = TestUtils.renderIntoDocument(
      <LoadingComplaintList />
    );
  });

  it('should exists', function () {
    expect(TestUtils.isCompositeComponent(loading)).toBeTruthy();
  });

  it('should have `Complaints` title and loading icon', function() {
    var div = TestUtils.scryRenderedDOMComponentsWithTag(loading, 'div')[0];
    expect(div.getDOMNode().textContent).toBe('Complaints');
    
    var iTags = TestUtils.scryRenderedDOMComponentsWithTag(loading, 'i');
    expect(iTags.length).toBe(1);
  })
});
