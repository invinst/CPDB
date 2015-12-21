var React = require('react');

var OfficerSummaryDetail = require('components/OfficerPage/OfficerSummary/OfficerSummaryDetail.react');
var OfficerAnalytics = require('components/OfficerPage/OfficerSummary/OfficerAnalytics.react');
var Navigator = require('components/OfficerPage/Navigator.react');


var OfficerSummaryContent = React.createClass({
  render: function () {
    return (
      <div className='officer-summary-content'>
        <OfficerSummaryDetail/>
        <OfficerAnalytics />
        <Navigator leftAction='related_officers' leftText='Related Officers'
                   rightAction='complaints' rightText='Complaints'
        />
      </div>
    )
  }
});

module.exports = OfficerSummaryContent;
