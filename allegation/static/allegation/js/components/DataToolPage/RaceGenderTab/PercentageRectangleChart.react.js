var _ = require('lodash');
var cx = require('classnames');
var React = require('react');
var PropTypes = React.PropTypes;
var FilterTagsActions = require('actions/FilterTagsActions');
var D3PercentageRectangleChart = require('utils/d3utils/PercentageRectangleChart');

var PercentageRectangleChart = React.createClass({
  propTypes: {
    category: PropTypes.string,
    filter: PropTypes.string,
    data: PropTypes.array,
    options: PropTypes.object
  },

  getInitialState: function () {
    return {
      uniqueId: _.uniqueId('percentage_rectangle_char_')
    };
  },

  componentDidMount: function () {
    this.drawPercentageRectangleChart();
  },

  componentDidUpdate: function () {
    this.drawPercentageRectangleChart();
  },

  clickHandler: function (blockData) {
    var category = this.props.category;
    var filter = this.props.filter;
    var filters = blockData['filters'];

    var tags = filters.map(function (obj) {
      return { 'value': obj.label, 'filter': filter + '=' + obj.value };
    });

    FilterTagsActions.toggleTags(category, tags);
    return false;
  },

  drawPercentageRectangleChart: function () {
    var className = '.' + this.state.uniqueId;

    D3PercentageRectangleChart.draw(
      this.props.data,
      this.props.options,
      className,
      this.clickHandler
    );
  },

  render: function () {
    var uniqueId = this.state.uniqueId;
    var className = cx(uniqueId, 'percentage-rectangle-chart', 'pointer');

    return (
      <div className={ className }></div>
    );
  }

});

module.exports = PercentageRectangleChart;
