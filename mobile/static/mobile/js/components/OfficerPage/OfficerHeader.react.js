var React = require('react');


var OfficerHeader = React.createClass({
  render: function () {
    return (
      <div className='officer-header'>
        <div className='badge-info'>
          <label>Badge &nbsp;</label>
          <span>12345</span>
        </div>
        <div className='name'>Raymon Piwinicki</div>
      </div>
    )
  }
});

module.exports = OfficerHeader;
