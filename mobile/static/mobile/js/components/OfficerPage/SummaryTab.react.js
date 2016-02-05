var React = require('react');

var OfficerSummarySection = require('components/OfficerPage/SummaryTab/OfficerSummarySection.react');
var OfficerAnalyticSection = require('components/OfficerPage/SummaryTab/OfficerAnalyticSection.react');


var SummaryTab = React.createClass({
  propTypes: {
    officer: React.PropTypes.object,
    distribution: React.PropTypes.distribution
  },

  render: function () {
    var officer = this.props.officer;
    var distribution = this.props.distribution;

    return (
      <div className='summary-tab'>
        <OfficerSummarySection officer={ officer } />
        <OfficerAnalyticSection officer={ officer } distribution={ distribution } />
      </div>
    );
  }
});

module.exports = SummaryTab;
