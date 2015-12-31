var React = require('react');
var PropTypes = React.PropTypes;

var DonutChartMixin = require('./DonutChartMixin');


var DonutChart = React.createClass({
  mixins: [DonutChartMixin],

  propTypes: {
    chartData: PropTypes.object.isRequired,
    chartColors: PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      chartColors: {},
      defaultColor: '#a5b4be'
    }
  },

  componentWillReceiveProps: function(newProps) {
    var browserData = this.buildBrowserData(newProps);
    this.chart.series[0].setData(browserData, true);
  },

  componentDidUpdate: function () {
    this.chart.reflow();
  },

  componentDidMount: function () {
    var browserData = this.buildBrowserData(this.props);
    this.chart = this.getHighChart(browserData);
  },

  render: function () {
    return (
      <div className='donut-chart'>
        <div id='donut-chart'></div>
        <div id="addText">
          {this.middleTextRender()}
        </div>
      </div>
    )
  },

  getHighChart: function (browserData) {
    return this.chart || new Highcharts.Chart({
        chart: {
          type: 'pie',
          backgroundColor: 'transparent',
          renderTo: 'donut-chart'
        },
        credits: false,
        title: {
          text: ''
        },
        plotOptions: {
          pie: {
            shadow: false,
            center: ['50%', '50%'],
            states: {
              hover: {
                enabled: false
              }
            }
          }

        },
        tooltip: false,
        series: [{
          name: 'Category',
          size: '100%',
          innerSize: '70%',
          data: browserData,
          dataLabels: {
            enabled: false
          }
        }]
      }
    );
  }
})

module.exports = DonutChart;
