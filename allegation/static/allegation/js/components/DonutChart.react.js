var React = require('react');


var DonutChart = React.createClass({
  getInitialState: function () {
    return {
      'disciplineCount': false,
      'totalComplaints': false
    }
  },
  componentDidMount: function () {
    var container = this.getDOMNode();
    var that = this;
    var colors = ["#a5b4be", '#0079ae'],
      browserData = [],
      i,
      dataLen,
      totalComplaints = 0,
      disciplineCount = 0;

    var data = [{
      name: "Disciplined",
      y: officer.discipline_count,
      color: "#a5b4be"
    }, {
      name: "Not disciplined",
      y: officer.allegations_count - officer.discipline_count,
      color: '#0079ae'
    }];

    dataLen = data.length;

    // Build the data arrays
    for (i = 0; i < dataLen; i += 1) {

      // add browser data
      browserData.push({
        name: data[i].name,
        y: data[i].y,
        color: colors[i],
        events: {
          mouseOver: function () {
            //that.setState({'series': this})
          }
        }
      });
    }
    that.setState({
      'totalComplaints': totalComplaints,
      'disciplineCount': disciplineCount
    });

    // Create the chart
    $(container).find(".donut-chart").highcharts({
      chart: {
        type: 'pie',
        backgroundColor: 'transparent'
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
      tooltip: {
        valueSuffix: ''
      },
      series: [{
        name: 'Category',
        size: '100%',
        innerSize: '70%',
        data: browserData,
        dataLabels: {
          enabled: false
        }
      }]
    });
  },
  render: function () {
    var summary = "";
    var percent = "";
    if (this.state.series) {
      percent = (this.state.series.y / this.state.totalComplaints * 100).toFixed(1);
      summary = <div>
        <h4>{this.state.series.name}</h4>
        <strong>{this.state.series.y}</strong> out of <strong>{this.state.totalComplaints}</strong> complaints
        <strong>({percent}%)</strong>
      </div>
    }
    else if (this.state.disciplineCount) {
      percent = (this.state.disciplineCount / this.state.totalComplaints * 100).toFixed(1);
      summary = <div>
        <h4><strong>{this.state.totalComplaints}</strong> Complaints Total</h4>
        <strong>{percent}%</strong> of <strong>{this.state.totalComplaints}</strong> resulted in disciplinary action
      </div>
    }
    return <div>
      <div className="donut-chart"></div>
      <div className='donut-summary'>{summary}</div>
    </div>
  }
});

module.exports = DonutChart;
