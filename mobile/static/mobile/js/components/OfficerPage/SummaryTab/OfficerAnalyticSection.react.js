var React = require('react');

var DistributionCurve = require('components/OfficerPage/SummaryTab/OfficerAnalyticSection/DistributionCurve.react');


var OfficerAnalyticSection = React.createClass({
  propTypes: {
    officer: React.PropTypes.object,
    distribution: React.PropTypes.array
  },

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
            <DistributionCurve officer={ this.props.officer } distribution={ this.props.distribution } />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OfficerAnalyticSection;
