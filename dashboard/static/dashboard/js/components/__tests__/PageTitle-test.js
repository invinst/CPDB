"use strict";

jest.autoMockOff();

describe('PageTitle', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var PageTitle = require('../PageTitle.react');

  it('should exists', function () {
    var pageTitle = TestUtils.renderIntoDocument(
      <PageTitle />
    );
    expect(TestUtils.isCompositeComponent(pageTitle)).toBeTruthy();
  });
});
