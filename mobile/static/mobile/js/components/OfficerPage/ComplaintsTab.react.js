var React = require('react');

var OfficerComplaintItem = require('components/OfficerPage/ComplaintTab/OfficerComplaintItem.react');


var OfficerComplaintContent = React.createClass({
  render: function () {
    return (
      <div className='complaints-tab'>
        <OfficerComplaintItem />
        <OfficerComplaintItem />
        <OfficerComplaintItem />
        <OfficerComplaintItem />
      </div>
    );
  }
});

module.exports = OfficerComplaintContent;
