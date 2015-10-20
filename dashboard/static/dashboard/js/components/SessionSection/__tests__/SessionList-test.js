"use strict";

jest.autoMockOff();

describe('SessionList', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var SessionList = require('components/SessionSection/SessionList.react');
  var sessionList;

  beforeEach(function() {
    sessionList = TestUtils.renderIntoDocument(
        <SessionList />
    );
  });

  it('should exists', function () {
    expect(TestUtils.isCompositeComponent(sessionList)).toBeTruthy();
  });
});
