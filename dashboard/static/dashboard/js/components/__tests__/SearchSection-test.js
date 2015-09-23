"use strict";

jest.autoMockOff();

describe('PageTitle', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var SearchSection = require('../SearchSection.react');
  var searchSection;

  beforeEach(function() {
    searchSection = TestUtils.renderIntoDocument(
        <SearchSection />
    );
  });

  it('should exists', function () {
    expect(TestUtils.isCompositeComponent(searchSection)).toBeTruthy();
  });
});
