"use strict";

jest.autoMockOff();

describe('SessionSection', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var SessionSection = require('components/SessionSection.react');
  var sessionSection;

  beforeEach(function() {
    sessionSection = TestUtils.renderIntoDocument(
        <SessionSection />
    );
  });

  it('should exists', function () {
    expect(TestUtils.isCompositeComponent(sessionSection)).toBeTruthy();
  });
});
