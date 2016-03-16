var React = require('react');

var HorizontalPercentageChart = require('components/DataToolPage/HorizontalPercentageChart.react');


var RaceGenderAgeTab = React.createClass({
  render: function () {
    var data = [
      {
        label: 'Black',
        count: 200
      },
      {
        label: 'White',
        count: 300
      },
      {
        label: 'Hispanic',
        count: 100
      },
      {
        label: 'Other',
        count: 50
      },
      {
        label: 'Asian',
        count: 1
      }
    ];

    return (
      <HorizontalPercentageChart label='Race' data={ data } />
    );
  }
});

module.exports = RaceGenderAgeTab;
