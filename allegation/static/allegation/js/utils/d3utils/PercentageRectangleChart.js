var d3 = require('d3');
var _ = require('lodash');
var calculatePercentages = require('utils/calculatePercentages');


var PercentageRectangleChart = {
  draw: function (data, options, domCSSPath, clickHandler) {
    // TODO: defaultOptions
    var colors = options.colors;
    var width = options.width;
    var height = options.height;
    var currentY,
      values,
      sum,
      n,
      minHeight,
      heightWithoutMinHeight,
      heightScale,
      ys,
      i,
      blocks;

    data = calculatePercentages(data);

    currentY = 0;
    values = _.pluck(data, 'value');
    sum = _.sum(values);
    n = data.length || 0;
    minHeight = 15;
    heightWithoutMinHeight = height - minHeight * n;

    heightScale = d3.scale.linear()
                        .domain([0, sum])
                        .range([0, heightWithoutMinHeight]);

    ys = [];
    for (i = 0; i < values.length; i++) {
      ys.push(currentY);
      currentY += heightScale(values[i]) + minHeight;
    }

    d3.select(domCSSPath + ' > *').remove();

    blocks = d3.select(domCSSPath)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .selectAll('rect')
      .data(data)
      .enter().append('g')
      .attr('class', function (data, i) {
        var inactiveClass = data['active'] ? '' : ' inactive';
        return data.label.toLowerCase() + inactiveClass;
      })
      .attr('transform', function (data, i) {
        return 'translate(0,' + ys[i] + ')';
      });

    blocks.append('rect')
      .style('fill', function (data, i) {
        return colors[i];
      })
      .attr('width', width)
      .attr('height', function (data, i) {
        return heightScale(data.value) + minHeight;
      })
      .on('click', clickHandler);

    blocks.append('svg:text')
      .attr('font-size', 12)
      .attr('fill', 'white')
      .attr('x', 20)
      .attr('y', function (d) { return heightScale(d.value) / 2 + minHeight - 5; })
      .text(function (d, i) {
        return d.label + ' ' + d.percent + '%';
      })
      .on('click', clickHandler);
  }
};

module.exports = PercentageRectangleChart;
