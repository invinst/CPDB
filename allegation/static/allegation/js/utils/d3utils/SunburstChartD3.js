var _ = require('lodash');
var d3 = require('d3');

var SUNBURST_ARC_COLORS = {
  'Allegation': '#bfd4df',
  'Unsustained': '#0079ae' ,
  'Sustained': '#ff6000',
  'No Affidavit': '#709dc0',
  'Discharged': '#cbcbcb',
  'No Cooperation': '#a5b4be',
  'Unfounded': '#172b3a',
  'Exonerate': '#62b28c',
  'Not Sustained': '#258aad',
  'Disciplined': '#cc0000',
  'Not Disciplined': '#ff9d5c',
  'Noted': '#ff9d5c',
  'Not Served (Resigned)': '#fdae6a',
  'Not Served (Inactive)': '#fdd0a2',
  'Reinstated by Court Action': '#669999',
  'Reinstated by Police Board': '#66cccc',
  'Unknown': '#989898',
  'No Action Taken': '#688b99',
  '1-9 days': '#ff8a90',
  'Reprimand': '#ff5454',
  '10-30 days': '#ed2121',
  'Termination': '#647a66',
  'Separation': '#4c544c',
  '30+ days': '#930c0c'
};


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
          .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    // fill data into svg
    svg.selectAll('path')
        .data(partition.nodes(data))
        .enter().append('path')
        .attr('d', arc)
        .style('fill', function (d) {
          if (!SUNBURST_ARC_COLORS[d.name]) {
            SUNBURST_ARC_COLORS[d.name] = color(sum(d));
          }
          return SUNBURST_ARC_COLORS[d.name];
        })
        .on('click', clickHandler);
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

      return path
    }

    return false;
  },
};

module.exports = SunburstChartD3;
