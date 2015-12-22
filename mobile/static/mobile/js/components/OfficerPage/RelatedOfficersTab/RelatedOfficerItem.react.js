var React = require('react');


var RelatedOfficerItem = React.createClass({
  render: function () {
    return (
      <div className='related-officer-item'>
        <div className='row pad'>
          <div className='one column'>
            <span className='circle'></span>
          </div>
          <div className='eight columns'>
            <div className='name'>Anthony Martin</div>
            <div className='gender'>Male (White)</div>
            <div className='description'>Co-accused in 3 cases</div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = RelatedOfficerItem;
