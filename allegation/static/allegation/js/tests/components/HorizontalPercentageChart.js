var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var ElementUtils = require('test_utils/ElementUtils');
var HorizontalPercentageChart = require('components/DataToolPage/HorizontalPercentageChart.react');


require('should');

describe('HorizontalPercentageChart component', function () {
  var horizontalPercentageChart;
  var expectData = [
    {
      label: 'b',
      translateX: 0,
      width: (100 - 4) * 0.4 + 2,
      value: 2,
      fill: '#A5B4BD',
      percent: 40,
      oldIndex: 0
    },
    {
      label: 'a',
      translateX: (100 - 4) * 0.4 + 2,
      width: (100 - 4) * 0.6 + 2,
      value: 3,
      fill: '#6A2122',
      percent: 60,
      oldIndex: 1
    }
  ];

  var chartData = [
    {
      label: 'a',
      count: 3
    },
    {
      label: 'b',
      count: 2
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
      <HorizontalPercentageChart data={ chartData } label={ '' }/>
    );

    horizontalPercentageChart.sortAndColorizeData().should.deepEqual(expectData);

  });

  it('should render chart correct with data', function () {
    horizontalPercentageChart = ReactTestUtils.renderIntoDocument(
      <HorizontalPercentageChart data={ chartData } label={ 'chart' }/>
    );

    ReactTestUtils.findRenderedDOMComponentWithClass(horizontalPercentageChart, 'chart-label')
      .textContent.should.equal('chart');

    ElementUtils.getElementsAttributeByTagName(horizontalPercentageChart, 'rect', 'width')
      .should.deepEqual([expectData[0].width + '%', expectData[1].width + '%']);
    ElementUtils.getElementsAttributeByTagName(horizontalPercentageChart, 'rect', 'style')
      .should.deepEqual(['fill:#A5B4BD;', 'fill:#6A2122;']);
    ElementUtils.getElementsAttributeByTagName(horizontalPercentageChart, 'rect', 'x')
      .should.deepEqual([expectData[0].translateX + '%', expectData[1].translateX + '%']);

    ElementUtils.getElementsTextByClassName(horizontalPercentageChart, 'segment-name').should.deepEqual(['b', 'a']);
    ElementUtils.getElementsTextByClassName(horizontalPercentageChart, 'segment-percentage')
      .should.deepEqual(['40%', '60%']);
  });

});
