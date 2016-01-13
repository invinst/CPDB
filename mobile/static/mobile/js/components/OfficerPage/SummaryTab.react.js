var React = require('react');

var OfficerSummarySection = require('components/OfficerPage/SummaryTab/OfficerSummarySection.react');
var OfficerAnalyticSection = require('components/OfficerPage/SummaryTab/OfficerAnalyticSection.react');
var OfficerPresenter = require('presenters/OfficerPresenter');


var SummaryTab = React.createClass({
  render: function () {
    var officer = this.props.officer;

    return (
      <div className='summary-tab'>
        <OfficerSummarySection officer={officer}/>
        <OfficerAnalyticSection officer={officer}/>
      </div>
    );
  }
});

module.exports = SummaryTab;
