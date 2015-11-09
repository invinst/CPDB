var React = require('react');
var numeral = require('numeral');
var _ = require('lodash');

var EmbedMixin = require('components/DataToolPage/Embed/Mixin.react');
var Base = require('components/Base.react');
var AppConstants = require('constants/AppConstants');
var SummaryActions = require('actions/SummaryActions');
var SunburstActions = require('actions/SunburstActions');
var FilterTagsActions = require('actions/FilterTagsActions');
var SunburstStore = require("stores/SunburstStore");
var FilterStore = require("stores/FilterStore");
var SunburstAPI = require('utils/SunburstAPI');

var width = 390,
  height = 390,
  radius,
  svg,
  path,
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

if ($(window).width() <= 1200) {
    height = width = 300;
}
radius = Math.min(width, height) / 2.2;

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

var Sunburst = React.createClass(_.assign(Base(SunburstStore), {
  mixins: [EmbedMixin],

  // embedding
  getEmbedCode: function () {
    var node = this.getDOMNode();
    var width = $(node).width();
    var height = $(node).height();
    var src = "/embed/?page=sunburst&query=" + encodeURIComponent(FilterStore.getQueryString());
    src += "&state=" + this.stateToString({name: this.state.selected.name});
    return '<iframe width="' + width + 'px" height="' + height + 'px" frameborder="0" src="' + this.absoluteUri(src)
       + '"></iframe>';
  },
  // end embedding

  makeTag: function (tag) {
    return {
      text: tag.label,
      value: [tag.category, tag.value]
    }
  },

  isEmbedding: function () {
    return this.props.tabs && this.props.tabs.embedding;
  },

  select: function (d) {
    if (this.isEmbedding()) {
      return;
    }

    var selected = this.state.selected;

    if (d == this.state.selected) {
      return;
    }

    this.zoomToSelected(d);

    setTimeout(this.selectAnimationDone.bind(this, d, selected), 750);

  },

  selectAnimationDone: function (d, selected) {
    if ((d == selected.parent) && selected.tagValue) {
      FilterTagsActions.removeTag(selected.tagValue.category, selected.tagValue)
    }

    if (d.tagValue) {
      if (d.tagValue.removeParent) {
        FilterTagsActions.removeTag(d.parent.tagValue.category, d.parent.tagValue);
      }
      FilterTagsActions.addTag(d.tagValue.category, d.tagValue);
    }

    SunburstActions.selectArc(d);
  },

  zoomToSelected: function (d) {
    path.transition()
      .duration(750)
      .attrTween("d", arcTween(d));

  },

  getAncestors: function (node) {
    var path = [];
    var current = node;
    while (current.parent) {
      path.unshift(current);
      current = current.parent;
    }
    return path;
  },

  mouseleave: function (d) {
    SunburstActions.leaveArc();
  },

  mouseover: function (d) {
    SunburstActions.hoverArc(d);
  },

  drawChart: function () {
    var data = SunburstStore.getState().data;
    if (!data) {
      return;
    }

    var that = this;

    d3.select("#sunburst-chart svg").remove();

    svg = d3.select("#sunburst-chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("id", "container")
      .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

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
      .on("click", this.select)
      .on("mouseover", this.mouseover);

    d3.select("#container").on("mouseleave", this.mouseleave);

    // update new state
    this.doAfterDraw();
  },

  doAfterDraw: function () {
    var selected = 'Allegations';
    if (this.props.selected) {
      selected = this.props.selected;
    }
    if (this.state.selected) {
      selected = this.state.selected.name;
    }

    selected = this.findPathByName(selected);
    setTimeout(function () {
      SunburstActions.selectArc(selected);
    }, 1);
  },

  findPathByName: function (name) {
    var path;
    svg.selectAll("path").each(function (d) {
      if (d.name == name) {
        path = d;
      }
    });
    return path;
  },

  onSelectedChange: function () {
    this.zoomToSelected(this.state.selected);
  },

  controlHover: function () {
    if (this.state.hovering) {
      svg.selectAll("path")
        .style("opacity", 0.3);

      var sequenceArray = this.getAncestors(this.state.hovering);
      svg.selectAll("path")
        .filter(function (node) {
          return (sequenceArray.indexOf(node) >= 0);
        })
        .style("opacity", 1);
    }
    if (this.state.control.mouseLeave) {
      var that = this;
      // Deactivate all segments during transition.
      svg.selectAll("path").on("mouseover", null);

      // Transition each segment to full opacity and then reactivate it.
      svg.selectAll("path")
        .transition()
        .duration(500)
        .style("opacity", 1)
        .each("end", function() {
          d3.select(this).on("mouseover", that.mouseover);
        });

      d3.select("#explanation")
          .style("visibility", "hidden");
    }
  },

  componentDidMount: function () {
    if ($(window).width() <= 1200) {
      $("#sunburst-chart").addClass("small");
    }

    SunburstStore.addChangeListener(this._onChange);
    SunburstStore.addDataChangeListener(this.drawChart);
    SunburstStore.addSelectedChangeListener(this.onSelectedChange);

    this.initTabs();

    SunburstAPI.getData(this.props.query);
    this.drawChart();
  },

  initTabs: function () {
    if (this.props.tabs.tabs.length > 0) {
      for(var i =0; i < this.props.tabs.tabs.length; i++){
        var tab = this.props.tabs.tabs[i];
        if(tab.drawChart) {
          this.props.tabs.tabs[i] = this;
          /* I am sorry for this code, blame: Bang!!!! */
        }
      }
    }
    else {
      this.props.tabs.tabs.push(this);
    }
  },

  componentWillUnmount: function() {
    SunburstStore.removeChangeListener(this._onChange);
    SunburstStore.removeDataChangeListener(this.drawChart);
    SunburstStore.removeSelectedChangeListener(this.onSelectedChange);
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
        <td className="size">{numeral(total).format(AppConstants.NUMERAL_FORMAT)}</td>
        <td className="name">{node.name}</td>
      </tr>
    );
  },

  renderBreadcrumb: function (node) {
    if (!node) {
      return;
    }
    var breadcrumb = [];
    var current = node;
    var key = 0;
    while (current.parent) {
      breadcrumb.unshift(this.makeBreadcrumb(current.parent, key++));
      current = current.parent;
    }
    breadcrumb.push(this.makeBreadcrumb(node, key++));
    return (
      <ol className="sunburst-breadcrumb">{breadcrumb}</ol>
    );
  },

  makeBreadcrumb: function (node, key) {
    var total = sum(node);
    var className = "sunburst-legend";
    if (node == this.state.selected) {
      className += " active";
    }

    return (
      <li key={key} className={className} onClick={this.select.bind(this, node)}>
        {numeral(total).format(AppConstants.NUMERAL_FORMAT)} <br />
        <span className="name">{node.name}</span>
      </li>
    )
  },


  render: function () {
    var that = this;
    var legends = [];
    var selected = this.state.selected;
    var percent = null;
    var theMax = {};
    var percentStatement = '';
    var hovering = this.state.hovering || selected;
    var total = sum(hovering);
    if (selected) {
      var max = 0;
      if (selected.parent) {
        legends.push(this.makeLegend(selected.parent));
      }
      legends.push(this.makeLegend(selected));

      if (hovering.children) {
        var childrenLength = hovering.children.length;
        for (var i = 0; i < childrenLength; i++) {
          var child = hovering.children[i];
          var size = sum(child);
          if (size > max) {
            theMax = child;
            max = size;
          }
        }
      }
      if (selected.children) {
        $.each(selected.children, function(i, child) {
          legends.push(that.makeLegend(child));
        });
      }


      if (max) {
        percent = (max * 100 / total).toFixed(2);
        percentStatement = (
          <div>
            <strong>{percent}%</strong> of "{hovering.name}" complaints were "{theMax.name}"
          </div>
        )
      }
    }

    var breadcrumb = this.renderBreadcrumb(hovering);

    return (
      <div className="row">
        <div className="col-md-12">
          {breadcrumb}
        </div>
        <div className="col-md-5 col-xs-5">
          <div id="sunburst-legend">
            <div className="root">
              {numeral(total).format(AppConstants.NUMERAL_FORMAT)} {hovering.name}
            </div>
            <div className="percent">
              {percentStatement}
            </div>
            <div className="list">
              <table><tbody>{legends}</tbody></table>
            </div>
          </div>
        </div>
        <div id="sunburst-chart" className="col-md-7 col-xs-7">
        </div>
      </div>
    );

  }
}));

module.exports = Sunburst;
