"use strict";

jest.autoMockOff();

describe('QueryListFilter', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var QueryListFilter = require('../QueryListFilter.react');
  var queryListFilter;

  beforeEach(function() {
    queryListFilter = TestUtils.renderIntoDocument(
        <QueryListFilter />
    );
  });

  it('should exists', function () {
    expect(TestUtils.isCompositeComponent(queryListFilter)).toBeTruthy();
  });
});
