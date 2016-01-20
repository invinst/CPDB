var _ = require('lodash');
var React = require('react');

var Base = require('components/Base.react');

var Breadcrumb = require('components/DataToolPage/Sunburst/Breadcrumb.react');
var Legend = require('components/DataToolPage/Sunburst/Legend.react');
var SunburstActions = require('actions/SunburstActions');
var FilterTagsActions = require('actions/FilterTagsActions');
var SunburstStore = require("stores/SunburstStore");
var SunburstChartD3 = require('utils/d3utils/SunburstChartD3');
var SessionAPI = require('utils/SessionAPI');


var Sunburst = React.createClass(_.assign(Base(SunburstStore), {

  componentDidMount: function () {
    SunburstStore.addChangeListener(this._onChange);
    SunburstStore.addDataChangeListener(this._onDataChange);
    SunburstStore.addSelectedChangeListener(this._onSelectedChange);
  },

  componentWillUnmount: function() {
    SunburstStore.removeChangeListener(this._onChange);
    SunburstStore.removeDataChangeListener(this._onDataChange);
    SunburstStore.removeSelectedChangeListener(this._onSelectedChange);
  },

  _onDataChange: function () {
    SunburstChartD3.draw(this.getChartData());

    var selected = SunburstStore.getSelected();

    if (selected) {
      SunburstChartD3.selectArc(selected);
    }
  },

  _onSelectedChange: function () {
    var selected = SunburstStore.getSelected();
    SunburstChartD3.selectArc(selected);
    SessionAPI.updateSessionInfo({'sunburst_arc': selected.name});
  },

  getChartData: function () {
    return {
      data: SunburstStore.getState().data,
      clickHandler: this.clickHandler,
      mouseOverHandler: this.mouseOverHandler,
      mouseLeaveHandler: this.mouseLeaveHandler
    }
  },

  clickHandler: function (d) {
    SunburstActions.selectArc(d, this.state.selected);
    FilterTagsActions.saveTags();
  },

  mouseOverHandler: function (d) {
    SunburstActions.hoverArc(d);
  },

  mouseLeaveHandler: function (d) {
    SunburstActions.leaveArc();
  },

  render: function () {
    return (
      <div className="clearfix">
        <div className="col-md-12">
          <Breadcrumb />
        </div>
        <div className="col-md-5 col-xs-5">
          <Legend />
        </div>
        <div id="sunburst-chart" className="col-md-7 col-xs-7">
        </div>
      </div>
    );
  }
}));

module.exports = Sunburst;
