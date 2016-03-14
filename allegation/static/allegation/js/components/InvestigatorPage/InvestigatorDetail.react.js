var React = require('react');
var PropTypes = React.PropTypes;

var DonutChart = require('components/DataToolPage/DonutChart.react');
var InvestigatorInformation = require('components/InvestigatorPage/InvestigatorInformation.react');
var Timeline = require('components/InvestigatorPage/Timeline.react');
var AppConstants = require('constants/AppConstants');


var InvestigatorDetail = React.createClass({
  propTypes: {
    data: PropTypes.object
  },

  getChartData: function () {
    return {
      'disciplined': {
        color: AppConstants['DONUT_CHART_DISCIPLINED_COLOR'],
        data: this.props.data['num_disciplined']
      },
      'undisciplined': {
        color: AppConstants['DONUT_CHART_UNDISCIPLINED_COLOR'],
        data: this.props.data['num_allegations'] - this.props.data['num_disciplined']
      }
    };
  },

  render: function () {
    var investigator = this.props.data.investigator;
    var chartData = this.getChartData();

    return (
      <div>
        <div className='row'>
          <div className='col-sm-9 h3'>
            { investigator.name }
          </div>
        </div>

        <InvestigatorInformation investigator={ investigator } />

        <div className='row visualization-information'>
          <div className='col-xs-6'>
            <Timeline isInvestigator={ true }/>
          </div>
          <div className='col-xs-6'>
            <DonutChart chartData={ chartData } />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = InvestigatorDetail;
