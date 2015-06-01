
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
              <div className="controls">
                <h3>Adjust graph</h3>
                <button className="btn btn-primary swap-axes" onClick={this.rotateChart} type="button">Swap axes</button>
              </div>
            </div>

  },

});

module.exports = DistributionChart