var React = require('react');

var DistributionCurve = require('components/OfficerPage/SummaryTab/DistributionCurve.react');


var OfficerAnalyticSection = React.createClass({
  render: function () {
    return (
      <div className='officer-analytic-section'>
        <div className='section-header'>
          <span className='pad'>
            <span className='section-title bold'>Officer analytics</span>
          </span>
        </div>
        <div className='distribution-curve'>
          <div className='distribution-curve-wrapper'>
            <DistributionCurve />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OfficerAnalyticSection;
