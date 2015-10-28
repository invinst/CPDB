var _ = require('lodash');
var _ = require('lodash');
var cx = require('classnames');
var d3 = require('d3');
var React = require('react');

var PercentageRectangleChart = React.createClass({
  getInitialState: function() {
    return {
      uniqueId: _.uniqueId('percentage_rectangle_char_')
    };
  },

  render: function () {
    var data = this.props.data;
    // TODO: defaultOptions
    var options = this.props.options
    var colors = options.colors;
    var width = options.width;
    var height = options.height;

    var currentY = 0;
    var values = _.pluck(data, 'value');
    var sum = _.sum(values);
    var n = data.length || 0;
    var minHeight = 15;
    var heightWithoutMinHeight = height - minHeight * n;

    var heightScale = d3.scale.linear()
                        .domain([0, sum])
                        .range([0, heightWithoutMinHeight]);

    var ys = []
    for (i = 0; i < values.length; i++) {
      ys.push(currentY);
      currentY += heightScale(values[i]) + minHeight;
    }

    var domCSSPath = '.' + this.state.uniqueId;
    d3.select(domCSSPath + ' > *').remove();

    var blocks = d3.select(domCSSPath)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .selectAll('rect').data(data)
                  .enter().append('g')
                  .attr('transform', function(data, i) {
                    return 'translate(0,' + ys[i] + ')';
                  });

      blocks.append('rect')
      .style('fill', function(data, i) {
        return colors[i];
      })
      .attr('width', width)
      .attr('height', function(data, i) {
        return heightScale(data.value) + minHeight;
      });


      blocks.append('svg:text')
                   .attr('font-size', 12)
                   .attr('fill', 'white')
                   .attr('x', 20)
                   .attr('y', function(d) { return heightScale(d.value) / 2 + minHeight - 5})
          .text(function(d, i) { return d.label + ' ' + (d.value * 100 / sum).toFixed(2) + '%';});


    var uniqueId = this.state.uniqueId;
    var className = cx(uniqueId, 'percentage-rectangle-chart');
    return (
        <div className={className}></div>
    );
  }
});

module.exports = PercentageRectangleChart;
