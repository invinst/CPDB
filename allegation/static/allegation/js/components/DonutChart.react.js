var React = require('react');


var DonutChart = React.createClass({
  getInitialState: function () {
    return {}
  },
  componentDidMount: function () {
    var container = this.getDOMNode();
    $.getJSON('/api/allegations/chart/', {'officer': officer.id}, function (categories) {
      var colors = Highcharts.getOptions().colors,
        data = [],
        browserData = [],
        versionsData = [],
        i,
        j,
        dataLen,
        drillDataLen,
        brightness;

      categories = categories.data;

      for(i = 0; i < categories.length; i++){
        var category = categories[i];
        var row = {
          name: category.name,
          y: category.total,
          color: colors[i],
          drilldown: category.drilldown
        };
        data.push(row);
      }
      console.log(data);

      dataLen = data.length;

      // Build the data arrays
      for (i = 0; i < dataLen; i += 1) {

        // add browser data
        browserData.push({
          name: data[i].name,
          y: data[i].y,
          color: colors[i]
        });

        // add version data
        drillDataLen = data[i].drilldown.data.length;
        for (j = 0; j < drillDataLen; j += 1) {
          brightness = 0.2 - (j / drillDataLen) / 5;
          versionsData.push({
            name: data[i].drilldown.categories[j],
            y: data[i].drilldown.data[j],
            color: Highcharts.Color(colors[i]).brighten(brightness).get()
          });
        }
      }

      // Create the chart
      $(container).highcharts({
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
          name: 'Result',
          data: versionsData,
          size: '80%',
          innerSize: '78%',
          dataLabels: {
            enabled: false
          }
        }, {
          name: 'Category',
          size: '100%',
          innerSize: '80%',
          data: browserData,
          dataLabels: {
            enabled: false
          }
        }]
      });

    });
  },
  render: function () {
    return <div className="donut-chart"></div>
  }
});

module.exports = DonutChart;
