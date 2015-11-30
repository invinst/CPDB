var React = require('react');

var DonutChart = require('components/Shared/DonutChart.react');


var StatisticSection = React.createClass({
  render: function () {
    return (
      <div className='statistic-section'>
        <div className='section-header'>
          <div className='section-title'>
            Statistic
          </div>
        </div>
        <div className='chart'>
          <DonutChart total={43} discipline={16}/>
        </div>
      </div>
    )
  }
});

module.exports = StatisticSection;
