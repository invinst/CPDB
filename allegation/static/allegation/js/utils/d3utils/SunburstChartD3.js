var _ = require('lodash');
var d3 = require('d3');

var AppConstants = require('../../constants/AppConstants');

function sum(d){
  var s = 0;
  if (d.children) {
    for (var i = 0; i < d.children.length; i++) {
      s += sum(d.children[i]);
    }
  } else {
    s = d.size;
  }
  return s;
}

// Global access
var x, y, radius, partition, arc, svg;


var SunburstChartD3 = {
  draw: function (options) {
    var data = options.data;
    var clickHandler = options.clickHandler;
    var mouseOverHandler = options.mouseOverHandler;
    var mouseLeaveHandler = options.mouseLeaveHandler;

    var width = 390;
    var height = 390;

    radius = Math.min(width, height) / 2.2;
    var color = d3.scale.category20c();

    x = d3.scale.linear().range([0, 2 * Math.PI]);
    y = d3.scale.sqrt().range([0, radius]);
    partition = d3.layout.partition().value(function (d) {
      return d.size;
    });

    arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

    d3.select("#sunburst-chart svg").remove();
    svg = d3.select('#sunburst-chart')
        .append('svg')
          .attr('width', width)
          .attr('height', height)
        .append('g')
          .attr('id', 'sunburstd3-chart-container')
          .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    // fill data into svg
    svg.selectAll('path')
        .data(partition.nodes(data))
        .enter().append('path')
        .attr('d', arc)
        .style('fill', function (d) {
          if (!AppConstants.SUNBURST_ARC_COLORS[d.name]) {
            AppConstants.SUNBURST_ARC_COLORS[d.name] = color(sum(d));
          }
          return AppConstants.SUNBURST_ARC_COLORS[d.name];
        })
        .on('click', clickHandler)
        .on('touchstart', clickHandler)
        .on('mouseover', mouseOverHandler);

    d3.select('#sunburstd3-chart-container')
        .on('mouseleave', mouseLeaveHandler);
  },

  selectArc: function (d) {
    if (!svg) {
      return;
    }

    svg.transition()
      .duration(750)
      .tween('scale', function () {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]);
        var yd = d3.interpolate(y.domain(), [d.y, 1]);
        var yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);

        return function (t) {
          x.domain(xd(t));
          y.domain(yd(t)).range(yr(t));
        };
      })
      .selectAll('path')
      .attrTween('d', function (d) {
        return function () { return arc(d); };
      });
  },

  findPathByName: function (name) {
    var path;

    if (svg) {
      svg.selectAll('path').each(function (d) {
        if (d.name == name) {
          path = d;
        }
      });

      if (path && path.size == 0) {
        svg.selectAll('path').each(function (d) {
          if (d.name == 'Allegations') {
            path = d;
          }
        });
      }

      return path
    }

    return false;
  },
};

module.exports = SunburstChartD3;
