var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var ElementUtils = require('test_utils/ElementUtils');
var HorizontalPercentageChart = require('components/DataToolPage/HorizontalPercentageChart.react');


require('should');

describe('HorizontalPercentageChart component', function () {
  var horizontalPercentageChart;

  afterEach(function () {
    if (horizontalPercentageChart) {
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(horizontalPercentageChart).parentNode);
    }
  });

  it('should return a correct result when using getSegmentColor', function () {
    horizontalPercentageChart = ReactTestUtils.renderIntoDocument(
      <HorizontalPercentageChart data={ [] } label={ '' }/>
    );

    horizontalPercentageChart.getSegmentColor(0, 1, ['a','b']).should.equal('a');
    horizontalPercentageChart.getSegmentColor(2, 3, ['a','b','c','d']).should.equal('d');
    horizontalPercentageChart.getSegmentColor(0, 3, ['a','b','c','d']).should.equal('a');
    horizontalPercentageChart.getSegmentColor(1, 3, ['a','b','c','d']).should.equal('b');
  });

  it('should return a correct result when using sortAndColorizeData', function () {
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

    horizontalPercentageChart = ReactTestUtils.renderIntoDocument(
      <HorizontalPercentageChart data={ chartData } label={ '' }/>
    );

    horizontalPercentageChart.sortAndColorizeData().should.deepEqual([
      {
        label: 'b',
        translateX: 0,
        width: (500 - 30) * 0.4 + 15,
        value: 2,
        fill: '#A5B4BD',
        percent: 40,
        oldIndex: 0
      },
      {
        label: 'a',
        translateX: (500 - 30) * 0.4 + 15,
        width: (500 - 30) * 0.6 + 15,
        value: 3,
        fill: '#6A2122',
        percent: 60,
        oldIndex: 1
      }
    ]);

  });

  it('should render chart correct with data', function () {
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

    horizontalPercentageChart = ReactTestUtils.renderIntoDocument(
      <HorizontalPercentageChart data={ chartData } label={ 'chart' }/>
    );

    ReactTestUtils.findRenderedDOMComponentWithClass(horizontalPercentageChart, 'chart-label')
      .textContent.should.equal('chart');

    ElementUtils.pluckElementsAttribute(horizontalPercentageChart, 'rect', 'width').should.deepEqual(['203', '297']);
    ElementUtils.pluckElementsAttribute(horizontalPercentageChart, 'rect', 'style')
      .should.deepEqual(['fill:#A5B4BD;', 'fill:#6A2122;']);
    ElementUtils.pluckElementsAttribute(horizontalPercentageChart, 'rect', 'transform')
      .should.deepEqual(['translate(0,0)', 'translate(203,0)']);

    ElementUtils.getElementsTextByClassName(horizontalPercentageChart, 'segment-name').should.deepEqual(['b', 'a']);
    ElementUtils.getElementsTextByClassName(horizontalPercentageChart, 'segment-percentage')
      .should.deepEqual(['40%', '60%']);
  });

});
