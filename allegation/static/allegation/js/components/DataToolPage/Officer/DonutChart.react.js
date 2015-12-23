var React = require('react');
var ReactDOM = require('react-dom');


var DISCIPLINED_COLOR = '#a5b4be';
var UNDISCIPLINED_COLOR = '#013270';

var chartColors = {
  'disciplined': DISCIPLINED_COLOR,
  'undisciplined': UNDISCIPLINED_COLOR
};

var chart = null;
// Moving data to Store?
var DonutChart = React.createClass({
  buildBrowserData: function(officer) {
    var nonDisciplines = officer.allegations_count - officer.discipline_count;
    var colors = [DISCIPLINED_COLOR, UNDISCIPLINED_COLOR],
      browserData = [],
      i,
      dataLen;

    var data = [{
      name: "Disciplined",
      y: officer.discipline_count,
      color: chartColors['disciplined']
    }, {
      name: "Not disciplined",
      y: nonDisciplines,
      color: chartColors['undisciplined']
    }];
    dataLen = data.length;

    // Build the data arrays
    for (i = 0; i < dataLen; i += 1) {
      // add browser data
      browserData.push({
        name: data[i].name,
        y: data[i].y,
        color: colors[i]
      });
    }

    return browserData;
  },

  updateTextInsideDonutChart: function(chart, officer) {
    officer = officer || this.props.officer;

    if (officer.discipline_count !== undefined) {
      $("#addText").html("");
      var span = '<span id="pieChartInfoText">';
      span += '<span style="font-size: 28px"><strong>' + officer.discipline_count +
              " / " + officer.allegations_count + '</strong><br /></span>';
      span += '<span style="font-size: 16px;">' +
        '<span style="color: ' + chartColors['undisciplined'] + '">allegations disciplined</span>' +
        '</span>';
      span += '</span>';

      $("#addText").append(span);
      span = $('#pieChartInfoText');
    }
  },

  componentWillReceiveProps: function(newProps) {
    var officer = newProps.officer
    var browserData = this.buildBrowserData(officer);

    this.chart.series[0].setData(browserData, true);
    this.updateTextInsideDonutChart(null, officer);
  },

  componentWillUnmount: function() {
    $(window).unbind('resize');
  },

  componentDidUpdate: function () {
    this.chart.reflow();
  },

  componentDidMount: function () {
    var container = ReactDOM.findDOMNode(this);
    var that = this;
    var colors = [DISCIPLINED_COLOR, UNDISCIPLINED_COLOR],
      browserData = [],
      i,
      dataLen;

    browserData = this.buildBrowserData(this.props.officer);
    // Create the chart
    this.chart = new Highcharts.Chart({
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
      },
      this.updateTextInsideDonutChart
    );
    //http://stackoverflow.com/questions/9732205/place-text-in-center-of-pie-chart-highcharts
    $(window).on('resize', function() {
      that.updateTextInsideDonutChart(that.chart, that.props.officer);
    });
  },
  render: function () {
    return <div className="relative">
        <div className='donut-chart' id='donut-chart'></div>
        <div id="addText"></div>
      </div>
  }
});

module.exports = DonutChart;
