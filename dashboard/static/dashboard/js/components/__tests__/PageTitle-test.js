"use strict";

jest.autoMockOff();

describe('PageTitle', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var PageTitle = require('../PageTitle.react');
  var pageTitle;

  beforeEach(function() {
    pageTitle = TestUtils.renderIntoDocument(
        <PageTitle />
    );
  });

  it('should exists', function () {
    expect(TestUtils.isCompositeComponent(pageTitle)).toBeTruthy();
  });

  it('should change base on the current state', function() {
    var text = 'Overview';
    pageTitle.setState({ activeItemText: text });
    var title = TestUtils.findRenderedDOMComponentWithTag(pageTitle, 'h1');
    expect(React.findDOMNode(title).textContent).toEqual(text);
  });
});
