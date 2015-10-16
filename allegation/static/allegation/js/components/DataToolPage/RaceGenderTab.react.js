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
      <PercentageRectangleChart data={data} options={options} />
    )
  }
});

module.exports = RaceGenderTab;
