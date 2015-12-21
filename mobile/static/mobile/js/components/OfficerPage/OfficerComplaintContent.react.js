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
        <Navigator leftAction='summary' leftText='Summary'
                   rightAction='related_officers' rightText='Related Officers'
        />
      </div>
    );
  }
});

module.exports = OfficerComplaintContent;
