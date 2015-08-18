var React = require('react');
var SummaryActions = require('../actions/SummaryActions');
var SunburstStore = require("../stores/SunburstStore");
var FilterStore = require("../stores/FilterStore");


var width = 760,
  height = 430,
  svg,
  path,
  radius = Math.min(width, height) / 2.2,
  colors = {
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

var color = d3.scale.category20c();

var x = d3.scale.linear()
  .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
  .range([0, radius]);

var partition = d3.layout.partition()
  .value(function (d) {
    return d.size;
  });

var arc = d3.svg.arc()
  .startAngle(function (d) {
    return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
  })
  .endAngle(function (d) {
    return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
  })
  .innerRadius(function (d) {
    return Math.max(0, y(d.y));
  })
  .outerRadius(function (d) {
    return Math.max(0, y(d.y + d.dy));
  });


// Interpolate the scales!
function arcTween(d) {
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
    yd = d3.interpolate(y.domain(), [d.y, 1]),
    yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
  return function (d, i) {
    return i
      ? function (t) {
      return arc(d);
    }
      : function (t) {
      x.domain(xd(t));
      y.domain(yd(t)).range(yr(t));
      return arc(d);
    };
  };
}


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

var Sunburst = React.createClass({
  getInitialState: function () {
    return SunburstStore.init();
  },
  makeTag: function (tag) {
    return {
      text: tag.label,
      value: [tag.category, tag.value]
    }
  },
  select: function (d) {
    if (d == this.state.selected) {
      return;
    }

    var selected = this.state.selected;

    this.setState({
      'selected': d
    });

    if ((d == selected.parent) && selected.tagValue) {
      FilterStore.tagsInputRemoveItemObject(this.makeTag(selected.tagValue));
    }

    if (d.tagValue) {
      $("#cpdb-search").tagsinput("add", this.makeTag(d.tagValue));
    }

    path.transition()
      .duration(750)
      .attrTween("d", arcTween(d));

  },
  drawChart: function () {
    if (this.state.drew) {
      return;
    }
    var data = this.state.data;
    if (!data) {
      return;
    }

    d3.select("#sunburst-chart svg").remove();

    svg = d3.select("#sunburst-chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

    d3.select(self.frameElement).style("height", height + "px");

    path = svg.selectAll("path")
      .data(partition.nodes(data))
      .enter().append("path")
      .attr("d", arc)
      .style("fill", function (d) {
        if (!colors[d.name]) {
          colors[d.name] = color(sum(d));
        }
        return colors[d.name];
      })
      .on("click", this.select);
    this.setState({
      drew: true
    });
  },
  componentDidUpdate: function() {
    this.drawChart();
  },
  componentDidMount: function () {
    SunburstStore.addChangeListener(this._onChange);
    SunburstStore.update();
  },
  _onChange: function () {
    this.setState(SunburstStore.getAll())
  },

  makeLegend: function (node) {
    var total = sum(node);
    if (!total) {
      return ''
    }
    var style = {
      color: colors[node.name]
    };
    return (
      <tr key={node.name} className="sunburst-legend" onClick={this.select.bind(this, node)}>
        <td className="color"><span className="fa fa-stop" style={style}></span></td>
        <td className="size">{total}</td>
        <td className="name">{node.name}</td>
      </tr>
    );
  },

  render: function () {
    var legends = [];
    var selected = this.state.selected;
    var total = sum(selected);
    var percent = null;
    var theMax = {};
    var percentStatement = '';
    if (selected) {
      var max = 0;
      if (selected.parent) {
        legends.push(this.makeLegend(selected.parent));
      }
      legends.push(this.makeLegend(selected));
      if (selected.children) {
        var childrenLength = selected.children.length;

        for (var i = 0; i < childrenLength; i++) {
          var child = selected.children[i];
          legends.push(this.makeLegend(child));
          var size = sum(child);
          if (size > max) {
            theMax = child;
            max = size;
          }
        }
      }
      if (max) {
        percent = (max * 100 / total).toFixed(2);
        percentStatement = (
          <div>
            <strong>{percent}%</strong> of {selected.name} complaints were resulted in {theMax.name}
          </div>
        )
      }
    }

    return (
      <div className="row">
        <div className="col-md-3">
          <div id="sunburst-legend">
            <div className="root">
              {total} <span className="name">{selected.name}</span>
            </div>
            <div className="percent">
              {percentStatement}
            </div>
            <div className="list">
              <table>{legends}</table>
            </div>
          </div>
        </div>
        <div id="sunburst-chart" className="col-md-9">
        </div>
      </div>
    );

  }
});

module.exports = Sunburst;
