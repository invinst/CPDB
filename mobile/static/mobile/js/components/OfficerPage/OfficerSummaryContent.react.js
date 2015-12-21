var React = require('react');

var OfficerSummaryDetail = require('components/OfficerPage/OfficerSummary/OfficerSummaryDetail.react');
var OfficerAnalytics = require('components/OfficerPage/OfficerSummary/OfficerAnalytics.react');


var OfficerSummaryContent = React.createClass({
  render: function () {
    return (
      <div className='officer-summary-content'>
        <OfficerSummaryDetail/>
        <OfficerAnalytics />
      </div>
    )
  }
});

module.exports = OfficerSummaryContent;
