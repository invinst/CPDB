var d3 = require('d3');
var _ = require('lodash');

function calculatePercentages(l) {
  var sum = _.reduce(l, function (acc, x) { return acc + x.value; }, 0);
  var off = 100 - _.reduce(l, function (acc, x) { return acc + Math.floor(x.value*100/sum); }, 0);
  return _.chain(l)
          .sortBy(function (x) { return Math.floor(x.value*100/sum) - (x.value*100/sum); })
          .map(function (x, i) {
            x.percent = Math.floor(x.value*100/sum) + (off >= l.length - i);
            return x;
          }).value();
}


var PercentageRectangleChart = {
  draw: function (data, options, domCSSPath, clickHandler) {
    // TODO: defaultOptions
    var colors = options.colors;
    var width = options.width;
    var height = options.height;
    data = calculatePercentages(data);

    var currentY = 0;
    var values = _.pluck(data, 'value');
    var sum = _.sum(values);
    var n = data.length || 0;
    var minHeight = 15;
    var heightWithoutMinHeight = height - minHeight * n;

    var heightScale = d3.scale.linear()
                        .domain([0, sum])
                        .range([0, heightWithoutMinHeight]);

    var ys = [];
    for (var i = 0; i < values.length; i++) {
      ys.push(currentY);
      currentY += heightScale(values[i]) + minHeight;
    }

    d3.select(domCSSPath + ' > *').remove();

    var blocks = d3.select(domCSSPath)
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
