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
    var results = this.state.data.results;
    var xs = _.pluck(results, 'created_date');
    var ys = _.pluck(results, 'count');
    var data = {
      labels: xs,
      datasets: [
        {
          data: ys,
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)"
        }
      ]
    };
    return (
      <div>
        <LineChart data={data} options={this.state.options} width={700} redraw={true} />
      </div>
    );
  }
}));

module.exports = NewSessionPerDayChart;
