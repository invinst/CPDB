var React = require('react');
var PropTypes = React.PropTypes;
var _ = require('lodash');
var d3 = require('d3');
var S = require('string');

var PureRenderMixin = require('react-addons-pure-render-mixin');


var HorizontalPercentageChart = React.createClass({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      count: PropTypes.number
    })),
    label: PropTypes.string
  },

  mixins: [PureRenderMixin],

  MIN_WIDTH: 15,

  TOTAL_WIDTH: 500,

  DEFAULT_HEIGHT: 50,

  DEFAULT_CHART_HEIGHT: 30,

  calculateData: function () {
    var sum = _.sum(this.props.data, 'count');
    var widthScale = this.calculateWidthScale(sum);
    var currentX = 0;
    var self = this;

    var result = _.map(this.props.data, function (datum, i) {
      var currentWidth = widthScale(datum.count) + self.MIN_WIDTH;

      result = {
        label: datum.label,
        translateX: currentX,
        width: currentWidth
      };

      currentX += widthScale(datum.count) + self.MIN_WIDTH;

      return result;
    });

    return _.sortBy(result, 'width');

  },

  calculateWidthScale: function (sum) {
    var width = this.TOTAL_WIDTH - this.MIN_WIDTH * this.props.data.length;
    return d3.scale.linear()
            .domain([0, sum])
            .range([0, width]);
  },

  render: function () {
    var segments = this.calculateData();
    var self = this;

    return (
      <div>
        <p>{ this.props.label }</p>
        <svg width={ this.TOTAL_WIDTH } height={ self.DEFAULT_HEIGHT }>
          { _.each(segments, function (segment, i) {
            var transformProp = S('translate({{x}},0)').template({x: segment.translateX}).s;
            return (
              <rect key={ i } width={ segment.width } height={ self.DEFAULT_CHART_HEIGHT }
                transform={ transformProp }/>
            );
          }) }
        </svg>
      </div>
    );
  }
});

module.exports = HorizontalPercentageChart;
