var React = require('react');

var DonutChart = require('components/Shared/DonutChart.react');

var TestPage = React.createClass({

  render: function () {
    return (
      <div>
        <DonutChart />
      </div>
    )
  }
});

module.exports = TestPage;
