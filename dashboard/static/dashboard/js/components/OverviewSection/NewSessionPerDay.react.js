var React = require('react');

var NewSessionPerDayChart = require('components/OverviewSection/NewSessionPerDay/NewSessionPerDayChart.react');


var NewSessionPerDay = React.createClass({
  render: function () {
    return (
      <div className='row'>
        <div className='col-sm-12'>
          <div className='section-header'>New sessions per day</div>
        </div>
        <div className='col-md-12'>
          <NewSessionPerDayChart />
        </div>
      </div>
    );
  }
});

module.exports = NewSessionPerDay;
