var React = require('react');


var DonutChart = React.createClass({
  getInitialState: function () {
    return {
      'disciplineCount': this.props.officer.discipline_count,
      'totalComplaints': this.props.officer.allegations_count
    }
  },
  componentDidMount: function () {
    var container = this.getDOMNode();
    var that = this;
    var colors = ["#a5b4be", '#0079ae'],
      browserData = [],
      i,
      dataLen;

    var data = [{
      name: "Disciplined",
      y: this.props.officer.discipline_count,
      color: "#a5b4be"
    }, {
      name: "Not disciplined",
      y: this.props.officer.allegations_count - this.props.officer.discipline_count,
      color: '#0079ae'
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

    // Create the chart
    var chart = new Highcharts.Chart({
        chart: {
          type: 'pie',
          backgroundColor: 'transparent',
          renderTo: 'donut-chart',
        },
        credits: false,
        title: {
          text: ''
        },
        plotOptions: {
          pie: {
            shadow: false,
            center: ['50%', '50%']
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
      function (chart) {
        var textX = chart.plotLeft + (chart.plotWidth  * 0.5);
        var textY = chart.plotTop  + (chart.plotHeight * 0.5);

        var span = '<span id="pieChartInfoText" style="position:absolute; text-align:center;">';
        span += '<span style="font-size: 28px"><strong>' + that.props.officer.discipline_count +
                " / " + that.props.officer.allegations_count + '</strong><br /></span>';
        span += '<span style="font-size: 16px;">complaints disciplined</span>';
        span += '</span>';

        $("#addText").append(span);
        span = $('#pieChartInfoText');

        span.css('left', textX + (span.width() * -0.5));
        span.css('top', textY + (span.height() * -0.5));
      }
    );
    //http://stackoverflow.com/questions/9732205/place-text-in-center-of-pie-chart-highcharts


  },
  render: function () {
    return <div className="relative">
        <div className='donut-chart' id='donut-chart'></div>
        <div id="addText" className='top-left absolute' ></div>
      </div>
  }
});

module.exports = DonutChart;
