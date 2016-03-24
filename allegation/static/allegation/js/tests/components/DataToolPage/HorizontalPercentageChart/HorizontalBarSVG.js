var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var sinon = require('sinon');

var ElementUtils = require('test_utils/ElementUtils');
var HorizontalBarSVG = require('components/DataToolPage/HorizontalPercentageChart/HorizontalBarSVG.react');
var FilterTagsActions = require('actions/FilterTagsActions');


require('should');

describe('HorizontalBarSVG component', function () {
  var horizontalBarSVG;

  afterEach(function () {
    if (horizontalBarSVG) {
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(horizontalBarSVG).parentNode);
    }
  });

  it('should render svg with correct attributes', function () {
    var segments = [
      {
        translateX: 0,
        width: 10,
        fill: 'red'
      },
      {
        translateX: 10,
        width: 90,
        fill: 'blue'
      }
    ];

    horizontalBarSVG = ReactTestUtils.renderIntoDocument(
      <HorizontalBarSVG segments={ segments } totalWidth={ 100 }/>
    );

    ElementUtils.getElementsAttributeByTagName(horizontalBarSVG, 'rect', 'width').should.deepEqual(['10%', '90%']);
    ElementUtils.getElementsAttributeByTagName(horizontalBarSVG, 'rect', 'x').should.deepEqual([
      '0%', '10%'
    ]);
    ElementUtils.getElementsAttributeByTagName(horizontalBarSVG, 'rect', 'style').should.deepEqual([
      'fill:red;', 'fill:blue;'
    ]);
  });

  it('should trigger filter when user click on segment', function () {
    var segments = [
      {
        translateX: 0,
        width: 10,
        fill: 'red',
        filters: [
          {
            value: 'a',
            displayValue: 'A'
          },
          {
            value: 'b',
            displayValue: 'B'
          }
        ]
      },
      {
        translateX: 10,
        width: 90,
        fill: 'blue',
        filters: [
          {
            value: 'c',
            displayValue: 'C'
          }
        ]
      }
    ];
    var segmentElements;
    sinon.stub(FilterTagsActions, 'toggleTags');

    horizontalBarSVG = ReactTestUtils.renderIntoDocument(
      <HorizontalBarSVG segments={ segments } totalWidth={ 100 } category='d' displayCategory='D'/>
    );

    segmentElements = ReactTestUtils.scryRenderedDOMComponentsWithTag(horizontalBarSVG, 'rect');

    ReactTestUtils.Simulate.click(segmentElements[0]);

    FilterTagsActions.toggleTags.calledWith([
      {
        value: 'a',
        displayValue: 'A',
        category: 'd',
        displayCategory: 'D'
      },
      {
        value: 'b',
        displayValue: 'B',
        category: 'd',
        displayCategory: 'D'
      }
    ]).should.be.true();
    FilterTagsActions.toggleTags.restore();
  });
});
