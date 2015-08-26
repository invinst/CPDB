"use strict";

jest.autoMockOff();

describe('OutcomeFilterItem', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var OutcomeFilter;

  beforeEach(function () {
    OutcomeFilter = require('../OutcomeFilterItem.react');
  });

  it('should exists', function () {
    var outcomeFilter = TestUtils.renderIntoDocument(
      <OutcomeFilter />
    );
    expect(TestUtils.isCompositeComponent(outcomeFilter)).toBeTruthy();
  });

  it('do not render empty', function() {
    var outcomeFilter = TestUtils.renderIntoDocument(
      <OutcomeFilter />
    );
    //var contents = TestUtils.scryRenderedDOMComponentsWithClass(accordion, 'accordion-content');
    //TestUtils.Simulate.click(contents[0].getDOMNode());
  });
});
