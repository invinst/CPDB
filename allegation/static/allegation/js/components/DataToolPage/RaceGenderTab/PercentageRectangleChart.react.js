var cx = require('classnames');
var d3 = require('d3');
var React = require('react');
var FilterTagsActions = require("actions/FilterTagsActions");
var D3PercentageRectangleChart = require("utils/d3utils/PercentageRectangleChart");

var PercentageRectangleChart = React.createClass({
  getInitialState: function() {
    return {
      uniqueId: _.uniqueId('percentage_rectangle_char_')
    };
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

  componentDidMount: function () {
    this.drawPercentageRectangleChart();
  },

  componentDidUpdate: function() {
    this.drawPercentageRectangleChart();
  },

  render: function () {
    var uniqueId = this.state.uniqueId;
    var className = cx(uniqueId, 'percentage-rectangle-chart', 'pointer');

    return (
        <div className={className}></div>
    );
  },

  clickHandler: function (blockData) {
    var category = this.props.category;
    var filter = this.props.filter;
    var vals = typeof(blockData['filterValue']) == 'object' ? blockData['filterValue'] : [blockData['filterValue']];
    var text = blockData['label'];
    var useValueAsText = (category == 'Complainant Race') || (category == 'Officer Race');

    var tags = vals.map(function (value) {
      text = useValueAsText ? value : text;

      return { 'value': text, 'filter': filter + '=' + value };
    });

    FilterTagsActions.toggleTags(category, tags);
    return false;
  }

});

module.exports = PercentageRectangleChart;
