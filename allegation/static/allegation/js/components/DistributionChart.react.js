
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var DistributionChartStore = require('../stores/DistributionChartStore');

var DistributionChart = React.createClass({
  getInitialState: function() {
     return {'selected':false}
  },
  componentDidMount: function() {
    DistributionChartStore.update();
  },
  rotateChart: function(){
    DistributionChartStore.rotateChart();
  },
  render: function(){
    return <div id="complained-officers">
              <div className="graph"></div>
            </div>

  },

});

module.exports = DistributionChart
