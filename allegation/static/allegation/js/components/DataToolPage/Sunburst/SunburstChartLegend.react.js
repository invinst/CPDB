
var React = require('react');
var ReactDOM = require('react-dom');

var SunburstChartD3 = require('utils/d3utils/SunburstChartD3');
var Legend = require('components/DataToolPage/Sunburst/Legend.react');


var SunburstChartLegend = React.createClass({
  componentDidMount: function () {
    this.drawSunburst();
  },

  drawSunburst: function () {
    SunburstChartD3.draw({
      data: this.props.data,
    });

    if (this.props.selected) {
      SunburstChartD3.selectArc(this.props.selected);
    }
  },

  render: function () {
    return (
      <div className="sunburst-chart-legend clearfix">
        <div className="col-md-5 col-xs-5">
          <Legend />
        </div>
        <div id="sunburst-chart" className="col-md-7 col-xs-7">
        </div>
      </div>
    );
  }
});

module.exports = SunburstChartLegend;
