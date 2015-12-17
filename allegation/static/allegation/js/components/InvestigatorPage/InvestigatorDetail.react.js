var React = require('react');
var classnames = require('classnames');
var PropTypes = React.PropTypes;

var InvestigatorDonutChart = require('components/InvestigatorPage/InvestigatorDonutChart.react');
var InvestigatorInformation = require('components/InvestigatorPage/InvestigatorInformation.react');
var Timeline = require('components/DataToolPage/Officer/Timeline.react');


var InvestigatorDetail = React.createClass({
  propTypes: {
    investigator: PropTypes.object.isRequired
  },

  getChartData: function () {
    var investigator = this.props.investigator;
    return {
      'Disciplined': investigator['discipline_count'],
      'Complaints': investigator['complaint_count']
    }
  },

  getChartColor: function () {
    return {
      'Disciplined':'#a5b4be',
      'Complaints':'#013270'
    }
  },

  render: function () {
    var investigator = this.props.investigator;
    var chartColor = this.getChartColor();
    var chartData = this.getChartData();

    return (
      <div>
        <div className='row'>
          <div className="col-sm-9 h3">
            {investigator.name.toUpperCase()}
          </div>
        </div>

        <InvestigatorInformation investigator={investigator}/>

        <div className="row visualization-information">
          <div className='col-xs-6'>
            <Timeline />
          </div>
          <div className='col-xs-6'>
            <InvestigatorDonutChart chartColors={chartColor} chartData={chartData} />
          </div>
        </div>
      </div>
    )
  }
});

module.exports = InvestigatorDetail;
