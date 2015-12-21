var React = require('react');


var OfficerAnalytics = React.createClass({
  render: function () {
    return (
      <div className='officer-analytics'>
        <div className='analytics-header'>Officer analytics</div>
        <div className='distribution-curve'>
          <span>
            (Complaint distribution curve)
          </span>
        </div>
      </div>
    )
  }
});

module.exports = OfficerAnalytics;
