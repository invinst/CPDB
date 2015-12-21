var React = require('react');

var OfficerComplaintItem = require('components/OfficerPage/OfficerComplaints/OfficerComplaintItem.react');
var Navigator = require('components/OfficerPage/Navigator.react');


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
