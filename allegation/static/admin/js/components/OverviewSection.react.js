var React = require('react');
var SearchTrafficAPI = require('../utils/SearchTrafficAPI');
var QueryItemList = require('./OverviewSection/QueryItemList.react');
var SearchTrafficChart = require('./OverviewSection/SearchTrafficChart.react');
var PeriodPicker = require('./OverviewSection/PeriodPicker.react');


var OverviewSection = React.createClass({
  componentDidMount: function () {
    SearchTrafficAPI.getTopQueries();
  },

  render: function () {
    return (
      <div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='section-header'>Search traffic over time</div>
          </div>
          <div className='col-sm-6'>
            <PeriodPicker />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-3 col-sm-12'>
            <QueryItemList />
          </div>
          <div className='col-md-8 col-sm-12'>
            <SearchTrafficChart />
          </div>
        </div>
      </div>
    )
  },
});

module.exports = OverviewSection;
