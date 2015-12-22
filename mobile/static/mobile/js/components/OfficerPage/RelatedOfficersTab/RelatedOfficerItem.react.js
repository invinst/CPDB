var React = require('react');


var RelatedOfficerItem = React.createClass({
  render: function () {
    return (
      <div className='related-officer-item pad'>
        <div className='row'>
          <div className='one column circle-wrapper center'>
            <span className='circle'></span>
          </div>
          <div className='eleven columns'>
            <div className='name bold'>Anthony Martin</div>
            <div className='gender'>Male (White)</div>
            <div className='description'>Co-accused in 3 cases</div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RelatedOfficerItem;
