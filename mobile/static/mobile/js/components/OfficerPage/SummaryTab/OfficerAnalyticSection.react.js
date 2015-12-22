var React = require('react');


var OfficerAnalyticSection = React.createClass({
  render: function () {
    return (
      <div className='officer-analytic-section'>
         <div className='section-header'>
            <span className='pad'>
              <span className='section-title bold'>Officer analytics</span>
            </span>
        </div>
        <div className='distribution-curve center'>
          <div>
            (Complaint distribution curve)
          </div>
        </div>
      </div>
    )
  }
});

module.exports = OfficerAnalyticSection;
