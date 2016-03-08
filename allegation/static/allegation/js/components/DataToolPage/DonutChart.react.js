var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;

var AppConstants = require('constants/AppConstants');


var DonutChart = React.createClass({
  propTypes: {
    chartData: PropTypes.object.isRequired
  },

  componentDidMount: function () {
    var browserData = this.buildBrowserData(this.props);
    this.chart = this.getHighChart(browserData);
  },

  componentWillReceiveProps: function (newProps) {
    var browserData = this.buildBrowserData(newProps);
    this.chart.series[0].setData(browserData, true);
  },

  componentDidUpdate: function () {
    this.chart.reflow();
  },

  defaultColor: AppConstants['DONUT_CHART_UNDISCIPLINED_COLOR'],

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
  },

  buildBrowserData: function (props) {
    var chartData = props.chartData;
    var defaultColor = this.defaultColor;

    return _.map(_.keys(chartData), function (chartDataKey) {
      var obj = chartData[chartDataKey];
      return {
        name: chartDataKey,
        y: obj.data,
        color: obj.color || defaultColor
      };
    });
  },

  renderMiddleText: function () {
    var chartData = this.buildBrowserData(this.props);
    var fractionText = _.first(chartData)['y'] + ' / ' + _.sum(chartData, 'y');

    return (
      <span>
        <span className='donut-chart-fraction-text'>
          <strong>{ fractionText }</strong>
          <br/>
        </span>
        <span className='donut-chart-label-text'>
          <span>
            <div>
              <span className='donut-chart-inner-text'>
                { 'allegations disciplined' }
              </span>
            </div>
          </span>
        </span>
      </span>
    );
  },

  render: function () {
    return (
      <div className='donut-chart'>
        <div id='donut-chart'></div>
        <div id='addText'>
          { this.renderMiddleText() }
        </div>
      </div>
    );
  }
});

module.exports = DonutChart;
