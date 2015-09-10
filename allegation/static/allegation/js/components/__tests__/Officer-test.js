"use strict";

jest.autoMockOff();

describe('Officer', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Officer = require('../Officer.react');
  it('should exists', function () {
    var officer = TestUtils.renderIntoDocument(
      <Officer />
    );
    expect(TestUtils.isCompositeComponent(officer)).toBeTruthy();
  });
});

