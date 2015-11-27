var React = require('react');


var ComplaintDetail = React.createClass({
  render: function () {
    return (
      <div className='complaint-detail'>
        <div className='under-line'>
          <div className='inline'>
            <label>CRID</label><span>104909</span>
          </div>
          <span className='seperator'>&nbsp;|&nbsp;</span>
          <div className='inline'><label>Incident Date</label><span>2014-10-23</span>
          </div>
        </div>
        <div className='under-line'>
          <label>Finding</label>
          <span>Open investigation</span>
        </div>
        <div className='under-line'>
          <label>Outcome</label>
          <span>No action taken</span>
        </div>
        <div>
          <label>Complaining Witness</label>
          <span>Black, Female, Age 25</span>
        </div>
      </div>
    )
  }
});

module.exports = ComplaintDetail;
