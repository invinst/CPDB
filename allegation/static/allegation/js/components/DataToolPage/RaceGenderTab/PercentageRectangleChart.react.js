var cx = require('classnames');
var d3 = require('d3');
var React = require('react');
var ReactDOM = require('react-dom');
var FilterTagsActions = require("actions/FilterTagsActions");
var D3PercentageRectangleChart = require("utils/d3utils/PercentageRectangleChart");

var PercentageRectangleChart = React.createClass({
  getInitialState: function() {
    return {
      uniqueId: _.uniqueId('percentage_rectangle_char_')
    };
  },

  componentDidUpdate: function() {
    D3PercentageRectangleChart.draw(this.props.data, this.props.options, '.'+this.state.uniqueId, this.clickHandler);
  },

  render: function () {
    var uniqueId = this.state.uniqueId;
    var className = cx(uniqueId, 'percentage-rectangle-chart', 'pointer');

    return (
        <div className={className}></div>
    );
  },

  clickHandler: function(blockData){
    var vals = typeof(blockData['filterValue']) == 'object' ? blockData['filterValue'] : [blockData['filterValue']];
    var tags = vals.map(function(value) {
      return { 'label': blockData['label'], 'value': value };
    });

    FilterTagsActions.addTag(this.props.filter, tags[0]);
    return false;
  }

});

module.exports = PercentageRectangleChart;
