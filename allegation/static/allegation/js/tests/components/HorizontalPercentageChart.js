var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var ElementUtils = require('test_utils/ElementUtils');
var HorizontalPercentageChart = require('components/DataToolPage/HorizontalPercentageChart.react');


require('should');

describe('HorizontalPercentageChart component', function () {
  var horizontalPercentageChart;
  var calculateWidth = function (percent) {
    return (100 - HorizontalPercentageChart.MIN_WIDTH * 2) * percent / 100 + HorizontalPercentageChart.MIN_WIDTH;
  };

  var expectData = [
    {
      label: 'b',
      translateX: 0,
      width: calculateWidth(40),
      value: 2,
      fill: '#A5B4BD',
      percent: 40,
      oldIndex: 0,
      filters: [
        {}
      ],
      active: true
    },
    {
      label: 'a',
      translateX: calculateWidth(40),
      width: calculateWidth(60),
      value: 3,
      fill: '#26527f',
      filters: [],
      percent: 60,
      oldIndex: 1,
      active: false
    }
  ];

  var chartData = [
    {
      label: 'a',
      count: 3,
      filters: [],
      active: false
    },
    {
      label: 'b',
      count: 2,
      filters: [
        {}
      ],
      active: true
    }
  ];

  afterEach(function () {
    if (horizontalPercentageChart) {
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(horizontalPercentageChart).parentNode);
    }
  });

  it('should return a correct result when using getSegmentColor', function () {
    HorizontalPercentageChart.getSegmentColor(0, 1, ['a','b']).should.equal('a');
    HorizontalPercentageChart.getSegmentColor(2, 3, ['a','b','c','d']).should.equal('d');
    HorizontalPercentageChart.getSegmentColor(0, 3, ['a','b','c','d']).should.equal('a');
    HorizontalPercentageChart.getSegmentColor(1, 3, ['a','b','c','d']).should.equal('b');
  });

  it('should return a correct result when using sortAndColorizeData', function () {
    horizontalPercentageChart = ReactTestUtils.renderIntoDocument(
      <HorizontalPercentageChart data={ chartData } label=''/>
    );

    horizontalPercentageChart.sortAndColorizeData().should.deepEqual(expectData);

  });

  it('should render chart correct with data', function () {
    horizontalPercentageChart = ReactTestUtils.renderIntoDocument(
      <HorizontalPercentageChart data={ chartData } label='chart'/>
    );

    ReactTestUtils.findRenderedDOMComponentWithClass(horizontalPercentageChart, 'chart-label')
      .textContent.should.equal('chart');

    ElementUtils.getElementsAttributeByTagName(horizontalPercentageChart, 'rect', 'width')
      .should.deepEqual([expectData[0].width + '%', expectData[1].width + '%']);
    ElementUtils.getElementsAttributeByTagName(horizontalPercentageChart, 'rect', 'style')
      .should.deepEqual(['fill:#A5B4BD;', 'fill:#26527f;']);
    ElementUtils.getElementsAttributeByTagName(horizontalPercentageChart, 'rect', 'x')
      .should.deepEqual([expectData[0].translateX + '%', expectData[1].translateX + '%']);
    ElementUtils.getElementsAttributeByTagName(horizontalPercentageChart, 'rect', 'class')
      .should.deepEqual(['active', '']);

    ElementUtils.getElementsTextByClassName(horizontalPercentageChart, 'segment-name').should.deepEqual(['b', 'a']);
    ElementUtils.getElementsTextByClassName(horizontalPercentageChart, 'segment-percentage')
      .should.deepEqual(['40%', '60%']);
  });

  it('should activate correct label on mouse over', function () {
    var firstSegment;

    horizontalPercentageChart = ReactTestUtils.renderIntoDocument(
      <HorizontalPercentageChart data={ chartData } label='chart'/>
    );

    firstSegment = ReactTestUtils.scryRenderedDOMComponentsWithTag(horizontalPercentageChart ,'rect')[0];
    ReactTestUtils.Simulate.mouseOver(firstSegment, {});
    ReactTestUtils.scryRenderedDOMComponentsWithClass(horizontalPercentageChart, 'segment-label')[0]
      .className.split(' ').should.containEql('hover');

    ReactTestUtils.Simulate.mouseOut(firstSegment, {});
    ReactTestUtils.scryRenderedDOMComponentsWithClass(horizontalPercentageChart, 'segment-label')[0]
      .className.split(' ').should.not.containEql('hover');
  });
});
