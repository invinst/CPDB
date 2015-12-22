var React = require('react');

var OfficerSummarySection = require('components/OfficerPage/SummaryTab/OfficerSummarySection.react');
var OfficerAnalyticSection = require('components/OfficerPage/SummaryTab/OfficerAnalyticSection.react');


var SummaryTab = React.createClass({
  render: function () {
    return (
      <div className='summary-tab'>
        <OfficerSummarySection />
        <OfficerAnalyticSection />
      </div>
    );
  }
});

module.exports = SummaryTab;
