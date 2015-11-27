var React = require('react');

var OfficerCard = require('components/Shared/OfficerList/OfficerCard.react');


var OfficerList = React.createClass({
  render: function () {
    return (
      <div className='officer-list'>
        <OfficerCard fullName='John Angelopoulos' description='Female Native American'/>
        <OfficerCard fullName='John Angelopoulos' description='Female Native American'/>
        <OfficerCard fullName='John Angelopoulos' description='Female Native American'/>
        <OfficerCard fullName='John Angelopoulos' description='Female Native American'/>
        <OfficerCard fullName='John Angelopoulos' description='Female Native American'/>
      </div>
    )
  }
});

module.exports = OfficerList;
