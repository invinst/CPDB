var _ = require('lodash');
var d3 = require('d3');
var React = require('react');

var PercentageRectangleChart = React.createClass({
  componentDidMount: function () {
    var data = this.props.data;
    var options = this.props.options
    var colors = options.colors;
    var width = options.width;
    var height = options.height;
    var currentY = 0;

    // TODO: defaultOptions
    var options = this.props.options;
    var values = _.pluck(data, 'value');
    var sum = _.sum(values);
    var heightScale = d3.scale.linear()
                        .domain([0, sum])
                        .range([0, height]);

    var ys = []
    for (i = 0; i < values.length; i++) {
      ys.push(currentY);
      currentY += heightScale(values[i])
    }

   var blocks = d3.select('#percentage-rectangle-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .selectAll('rect').data(data)
                  .enter().append('g')
                  .attr('transform', function(data, i) {
                    return 'translate(0,' + ys[i] + ')';
                  })

      blocks.append('rect')
      .style('fill', function(data, i) {
        return colors[i];
      })
      .attr('width', width)
      .attr('height', function(data, i) {
        return heightScale(data.value);
      })


      blocks.append('svg:text')
                  .attr('font-size', 12)
                  .attr('fill', 'white')
                  .attr('x', 40)
                  .attr('y', function(d) { return heightScale(d.value) / 2})
                  .text(function(d, i) { return d.label + '   ' + (d.value * 100 / sum) + '%';})

  },

  render: function () {
    return (
      <div id='percentage-rectangle-chart'></div>
    );
  }
});

module.exports = PercentageRectangleChart;
