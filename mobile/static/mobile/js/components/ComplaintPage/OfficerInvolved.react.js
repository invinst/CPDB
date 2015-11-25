var React = require('react');

var OfficerList = require('components/Shared/OfficerList.react');

var OfficerInvolved =  React.createClass({
  render: function(){
    return  (
      <div className='officer-involved'>
        <div className='section-header'>
          <span className='section-title'>Officers involved</span>
          <span className='pull-right'>Collapse</span>
        </div>
        <OfficerList/>
      </div>
    )
  }
});

module.exports = OfficerInvolved;
