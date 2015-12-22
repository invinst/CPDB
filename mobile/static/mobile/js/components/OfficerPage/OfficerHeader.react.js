var React = require('react');


var OfficerHeader = React.createClass({
  render: function () {
    return (
      <div className='officer-header'>
        <div className='pad'>
          <div className='badge-info'>
            <span className='badge-label'>Badge &nbsp;</span>
            <span>12345</span>
          </div>
          <div className='name'>Raymond Piwinicki</div>
        </div>
      </div>
    );
  }
});

module.exports = OfficerHeader;
