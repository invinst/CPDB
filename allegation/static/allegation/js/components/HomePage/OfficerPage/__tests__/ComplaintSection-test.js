"use strict";

jest.autoMockOff();

describe('OfficerPage/ComplaintSection', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var complaints;
  var ComplaintSectionStore = require('stores/OfficerPage/ComplaintSectionStore');
  var ComplaintSection = require('../ComplaintSection.react');

  it('should exists', function () {
    complaints = TestUtils.renderIntoDocument(
      <ComplaintSection officer={{id: 1}}/>
    );
    expect(TestUtils.isCompositeComponent(complaints)).toBeTruthy();
  });
});

