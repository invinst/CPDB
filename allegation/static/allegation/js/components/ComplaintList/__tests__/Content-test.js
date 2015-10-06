"use strict";

jest.autoMockOff();

describe('Content', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var loading;
  var display;
  var complaints = [];

  beforeEach(function () {
    var Content = require('../Content.react');
    loading = TestUtils.renderIntoDocument(
      <Content loading={true} />
    );

    display = TestUtils.renderIntoDocument(
      <Content loading={false} complaints={complaints} />
    );
  });

  it('should exists', function () {
    expect(TestUtils.isCompositeComponent(loading)).toBeTruthy();
  });

  it('should have loading icon', function() {
    var iTags = TestUtils.scryRenderedDOMComponentsWithTag(loading, 'i');
    expect(iTags.length).toBe(1);
  });

  it('should not have loading icon', function () {
    var iTags = TestUtils.scryRenderedDOMComponentsWithTag(display, 'i');
    expect(iTags.length).toBe(0);
  });
});
