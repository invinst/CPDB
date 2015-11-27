var React = require('react');

var InvestigatorCard = require('components/Shared/InvestigatorCard.react');


var InvestigatorSection = React.createClass({
  render: function () {
    return (
      <div className='investigator'>
        <div className='section-header'>
          <div className='section-title'>Investigators</div>
        </div>
        <InvestigatorCard />
      </div>
    )
  }
});

module.exports = InvestigatorSection;
