var React = require('react');

var OfficerList = require('components/Shared/OfficerList.react');
var Collapse = require('components/Shared/Collapse.react');

var OfficerInvolved =  React.createClass({
  render: function(){
    return  (
      <div className='officer-involved'>
        <Collapse maxHeight={5000}>
        <div className='section-header'>
          <span className='section-title'>Officers involved</span>
          <span className='pull-right collapse-action'>Collapse</span>
        </div>
        <div className='collapse-content animation-long'>
          <OfficerList/>
        </div>
        </Collapse>
      </div>
    )
  }
});

module.exports = OfficerInvolved;
