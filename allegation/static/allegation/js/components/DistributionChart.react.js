var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var DistributionChartStore = require('../stores/DistributionChartStore');

var DistributionChart = React.createClass({
  getInitialState: function () {
    return {'selected': false}
  },
  componentDidMount: function () {
    DistributionChartStore.listen(this);
  },
  rotateChart: function () {
    DistributionChartStore.rotateChart();
  },
  render: function () {
    return <div id="complained-officers">
      <h3>Complaints per Officer</h3>

      <div className="graph"></div>
    </div>

  }

});

module.exports = DistributionChart;
