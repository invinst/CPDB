var React = require('react');

var ComplaintResult = React.createClass({
  render: function () {
    return (
      <div className='complaint-item'>
        <div className="complaint-category">
          Arrest/Look-up Procedures
        </div>
        <div className="complaint-sub-category">
          03C Search Of Premise/Vehicle Without Warrant
        </div>
        <div className="complaint-detail-row">
          <label>Incident Date</label>
          <span>2014-10-23</span>
        </div>
        <div className="complaint-detail-row">
          <label>Finding</label>
          <span>Exonerated</span>
        </div>
        <div className="complaint-detail-row">
          <label>Outcome</label>
          <span>No action taken</span>
        </div>
        <button>Request</button>
      </div>
    )
  }
});

module.exports = ComplaintResult;
