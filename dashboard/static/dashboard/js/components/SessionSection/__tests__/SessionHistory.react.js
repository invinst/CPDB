"use strict";

jest.autoMockOff();

describe('SessionHistory', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var SessionHistory = require('components/SessionSection/SessionHistory.react');
  var history;

  beforeEach(function() {
    history = TestUtils.renderIntoDocument(
        <SessionHistory />
    );
  });

  it('should exists', function () {
    expect(TestUtils.isCompositeComponent(history)).toBeTruthy();
  });
});
