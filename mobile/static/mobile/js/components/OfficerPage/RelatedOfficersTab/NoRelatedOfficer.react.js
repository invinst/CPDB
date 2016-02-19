var React = require('react');


var NoRelatedOfficer = React.createClass({
  render: function () {
    return (
      <div className='no-related-officer pad'>
        No any officer related to this officer.
      </div>
    );
  }
});

module.exports = NoRelatedOfficer;
