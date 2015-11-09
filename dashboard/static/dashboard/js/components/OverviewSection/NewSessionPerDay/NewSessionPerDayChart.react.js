var _ = require('lodash');
var LineChart = require("react-chartjs").Line;
var React = require('react');

var Base = require('../../Base.react');
var NewSessionPerDayChartStore = require('stores/OverviewSection/NewSessionPerDay/NewSessionPerDayChartStore');
var NewSessionAnalyticAPI = require('utils/NewSessionAnalyticAPI');

var NewSessionPerDayChart = React.createClass(_.assign(Base(NewSessionPerDayChartStore), {
  componentDidMount: function() {
    NewSessionPerDayChartStore.addChangeListener(this._onChange);
    NewSessionAnalyticAPI.getRecent();
  },

  render: function() {
    return (
      <div>
        <LineChart data={this.state.chartData} options={this.state.options} width={700} redraw={true} />
      </div>
    );
  }
}));

module.exports = NewSessionPerDayChart;
