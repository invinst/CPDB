var React = require('react');
var PropTypes = React.PropTypes;
var _ = require('lodash');
var d3 = require('d3');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var classnames = require('classnames');

var calculatePercentages = require('utils/calculatePercentages');
var LabelBar = require('components/DataToolPage/HorizontalPercentageChart/LabelBar.react');
var HorizontalBarSVG = require('components/DataToolPage/HorizontalPercentageChart/HorizontalBarSVG.react');


var HorizontalPercentageChart = React.createClass({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      count: PropTypes.number
    })),
    className: PropTypes.string,
    label: PropTypes.string,
    displayCategory: PropTypes.string,
    category: PropTypes.string
  },

  mixins: [PureRenderMixin],

  totalWidth: 100,
  defaultChartHeight: 30,
  defaultColorRange: [
    '#A5B4BD', '#6B8EE6', '#4E76C5', '#3860BF', '#26527f'
  ],

  sortAndColorizeData: function () {
    var sum = _.sum(this.props.data, 'count');
    var widthScale = this.calculateWidthScale(sum);
    var currentX = 0;
    var dataLength = this.props.data.length;
    var self = this;

    var result = _.map(_.sortBy(this.props.data, 'count'), function (datum, i) {
      var currentWidth = widthScale(datum.count) + HorizontalPercentageChart.MIN_WIDTH;
      var returnValue = {
        label: datum.label,
        translateX: currentX,
        width: currentWidth,
        value: datum.count,
        filters: datum.filters,
        fill: HorizontalPercentageChart.getSegmentColor(i, dataLength, self.defaultColorRange)
      };

      currentX += currentWidth;

      return returnValue;
    });

    result = calculatePercentages(result);

    return result;
  },

  calculateWidthScale: function (sum) {
    var width = this.totalWidth - HorizontalPercentageChart.MIN_WIDTH * this.props.data.length;
    return d3.scale.linear()
      .domain([0, sum])
      .range([0, width]);
  },

  render: function () {
    var segments = this.sortAndColorizeData();
    var classNames = classnames('horizontal-percentage-chart', this.props.className);

    return (
      <div className={ classNames }>
        <p className='chart-label'>{ this.props.label }</p>
        <HorizontalBarSVG segments={ segments } category={ this.props.category }
          displayCategory={ this.props.displayCategory }/>
        <LabelBar segments={ segments }/>
      </div>
    );
  }
});

HorizontalPercentageChart.getSegmentColor = function (index, numOfSegments, colorRange) {
  return (index === numOfSegments - 1) && (numOfSegments !== 1) ?
    colorRange[colorRange.length - 1] :
    colorRange[index];
};
HorizontalPercentageChart.MIN_WIDTH = 3;

module.exports = HorizontalPercentageChart;
