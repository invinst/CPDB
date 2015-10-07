"use strict";

jest.autoMockOff();

describe('OutcomeFilterItem', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var OutcomeFilterItem;

  beforeEach(function () {
    OutcomeFilterItem = require('../OutcomeFilterItem.react');
  });

  it('should exists', function () {
    var outcomeFilterItem = TestUtils.renderIntoDocument(
      <OutcomeFilterItem />
    );
    expect(TestUtils.isCompositeComponent(outcomeFilterItem)).toBeTruthy();
  });

  it('should have `active` class if active props is true', function () {
    var item = TestUtils.renderIntoDocument(
      <OutcomeFilterItem active={true}/>
    );

    var span = TestUtils.scryRenderedDOMComponentsWithTag(
          item, 'span'
    )[0];

    expect(span.getDOMNode().getAttribute('class')).toBe('active');
  })
});
