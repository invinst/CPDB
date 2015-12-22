var React = require('react');


var OfficerComplaintItem = React.createClass({
  render: function () {
    return (
      <div className='officer-complaint-item'>
        <div className='crid-info pad'>
          <div className='inline-block half-width align-left'>
            <span className='crid-title'>CRID &nbsp;</span>
            <span className='crid-number'>123456</span>
          </div>
          <div className='inline-block half-width align-right'>
            <span className='final-finding'>Not sustained</span>
          </div>
        </div>
        <div className='complaint-category'>
          <div className='pad'>
            <div className='category'>Use of Force</div>
            <div className='sub-category'>Excessive Force / On Duty - No injury</div>
          </div>
        </div>
        <div className='related-info pad'>
          <div className='row'>
            <span className='label'>Incident</span>
            <span className='value'>December 11th, 2013</span>
          </div>
          <div className='row'>
            <span className='label'>Officers</span>
            <span className='value'>
              Raymond Plwinick and 3 others   make this text looooooooonger
            </span>
          </div>
          <div className='circles row'>
            <div className='circle-wrapper'>
              <span className='circle'></span>
            </div>
            <div className='circle-wrapper'>
              <span className='circle'></span>
            </div>
            <div className='circle-wrapper'>
              <span className='circle'></span>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = OfficerComplaintItem;
