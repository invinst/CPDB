var React = require('react');

var OfficerComplaintItem = require('components/OfficerPage/OfficerComplaintItem.react');


var OfficerComplaintContent = React.createClass({
  render: function () {
    return (
      <div className='officer-complaint-details'>
        <OfficerComplaintItem />
        <OfficerComplaintItem />
        <OfficerComplaintItem />
        <OfficerComplaintItem />
      </div>
    );
  }
});

module.exports = OfficerComplaintContent;
