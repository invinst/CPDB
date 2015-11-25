var cx = require('classnames');
var React = require('react');
var InvestigateCard = require('components/Shared/InvestigateCard.react');
var OfficerList = require('components/Shared/OfficerList.react');

var InvestigatorPanel =  React.createClass({
  render: function(){
    return  (
      <div className='investigator'>
        <div className='section-header'>
          <div className='section-title'>Investigators</div>
        </div>
        <InvestigateCard />
        <InvestigateCard />
        <InvestigateCard />
      </div>
    )
  }
});

module.exports = InvestigatorPanel;
