var React = require('react');
var SearchTrafficChartStore = require('../../stores/OverviewSection/SearchTrafficChartStore');
var LineChart = require("react-chartjs").Line;
var Chart = require("react-chartjs");

var SearchTrafficChart = React.createClass({
  getInitialState: function() {
    return SearchTrafficChartStore.getState();
  },

  componentDidMount: function() {
    SearchTrafficChartStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SearchTrafficChartStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div id='search-traffic-chart-wrapper'>
        <LineChart data={this.state.chartData} options={this.state.options} width={700}   redraw={true} />
      </div>
    );
  },

  _onChange: function() {
    this.setState(SearchTrafficChartStore.getState());
  }
});

module.exports = SearchTrafficChart;
