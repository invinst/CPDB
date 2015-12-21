var React = require('react');


var OfficerComplaintItem = React.createClass({
  render: function () {
    return (
      <div className='complaint-detail-item'>
        <div className='basic-info'>
          <label className='label'>CRID &nbsp;</label>
          <span className='value'>123456</span>
          <span className='final-result'>Not sustained</span>
        </div>
        <div className='complaint-category'>
          <div className='category'>Use of Force</div>
          <div className='sub-category'>Excessive Force / On Duty - No injury</div>
        </div>
        <div className='row'>
          <div className='two columns'>
            <div className='label'>Incident</div>
            <div className='label'>Officers</div>

          </div>
          <div className='eight columns'>
            <div className='value'>&nbsp;December 11th, 2013</div>
            <div className='value'>&nbsp;Raymond Plwinick and 3 others</div>
            <div>
              &nbsp;
              <span className='circle'></span>
              <span className='circle'></span>
              <span className='circle'></span>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = OfficerComplaintItem;
