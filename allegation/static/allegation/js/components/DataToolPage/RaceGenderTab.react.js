var React = require('react');

var PercentageRectangleChart = require('components/DataToolPage/RaceGenderTab/PercentageRectangleChart.react');

var RaceGenderTab = React.createClass({
  render: function () {
    var options = {
      colors: ['#FF8033', '#FF6000'],
      width: 145,
      height: 155
    }

    var data = [
      {
        label: 'Male',
        value: 30
      },
      {
        label: 'Female',
        value: 70
      }
    ];

    return (
      <div id='gender-race-tab'>
        <div className='content'>
          <div className='row'>
            <div className='col-md-3 col-sm-3 col-xs-4 col-md-offset-1 col-sm-offset-1 col-xs-offset-1'>
              <span className='chart-title'>Officer</span>
            </div>
            <div className='col-md-3 col-sm-3 col-xs-4'>
              <span className='chart-title'>Complaint</span>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-1 col-sm-1 col-xs-1'>
              <span className='vertical-text chart-title'>
                Gender
              </span>
            </div>
            <div className='col-md-3 col-sm-2 col-xs-4'>
              <PercentageRectangleChart data={data} options={options} />
            </div>
            <div className='hidden-lg hidden-md col-sm-1 col-xs-1'>
            </div>
            <div className='col-md-3 col-sm-2 col-xs-4'>
              <PercentageRectangleChart data={data} options={options} />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-1 col-sm-1 col-xs-1'>
              <span className='vertical-text chart-title'>
                Race
              </span>
            </div>
            <div className='col-md-3 col-sm-2  col-xs-4'>
              <PercentageRectangleChart data={data} options={options} />
            </div>
            <div className='hidden-lg hidden-md col-sm-1 col-xs-1'>
            </div>
            <div className='col-md-3 col-sm-2 col-xs-4'>
              <PercentageRectangleChart data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = RaceGenderTab;
