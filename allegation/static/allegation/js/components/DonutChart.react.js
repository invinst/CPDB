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
    $.getJSON('/api/allegations/chart/', {'officer': officer.id}, function (categories) {
      var colors = Highcharts.getOptions().colors,
        data = [],
        browserData = [],
        versionsData = [],
        i,
        j,
        dataLen,
        drillDataLen,
        brightness,
        totalComplaints=0,
        disciplineCount=0;

      categories = categories.data;

      for(i = 0; i < categories.length; i++){
        var category = categories[i];
        totalComplaints += category.total;
        disciplineCount += category.drilldown.data[0];
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
          color: colors[i],
          events: {
            mouseOver: function(){
              //that.setState({'series': this})
            }
          }
        });

        // add version data
        drillDataLen = data[i].drilldown.data.length;
        for (j = 0; j < drillDataLen; j += 1) {
          brightness = 0.2 - (j / drillDataLen) / 5;
          var seriesData = data[i];
          versionsData.push({
            name: data[i].drilldown.categories[j],
            y: data[i].drilldown.data[j],
            color: Highcharts.Color(colors[i]).brighten(brightness).get(),
            events: {
              mouseOver: function(){
                that.setState({
                  'series': this,
                })
              },
              mouseOut: function(){
                that.setState({
                  'series': false,
                })
              }
          }
          });
        }
      }
      that.setState({
        'totalComplaints': totalComplaints,
        'disciplineCount': disciplineCount,
      })

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
    var summary = "";
    var percent = "";
    if(this.state.series){
      percent = (this.state.series.y / this.state.totalComplaints * 100).toFixed(1);
      summary = <div>
                  <h4>{this.state.series.name}</h4>
                  <strong>{this.state.series.y}</strong> out of <strong>{this.state.totalComplaints}</strong> complaints <strong>({percent}%)</strong>
              </div>
    }
    else if(this.state.disciplineCount){
       percent = (this.state.disciplineCount/this.state.totalComplaints * 100).toFixed(1);
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
