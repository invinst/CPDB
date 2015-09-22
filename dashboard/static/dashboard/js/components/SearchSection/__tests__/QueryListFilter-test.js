"use strict";

jest.autoMockOff();


describe('QueryListFilter', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var _ = require('lodash');
  var AppConstants = require('../../../constants/AppConstants');
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

  it('should render `QUERY_LIST_FILTERS`links', function() {
    _.every(AppConstants.QUERY_LIST_FILTERS, function(x) {
      expect(queryListFilter.getDOMNode().textContent).toContain(x);
    });
  });

  it('should have active class when doing click on the item', function() {
    var failAttempts = TestUtils.findRenderedDOMComponentWithClass(queryListFilter, 'filter-fail-attempts').getDOMNode();
    TestUtils.Simulate.click(failAttempts);
    expect(failAttempts.className).toContain('active');
  });
});
