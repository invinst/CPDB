var React = require('react');

var InvestigatorCard = require('components/Shared/InvestigatorCard.react');


var InvestigatorSection = React.createClass({
  render: function () {
    return (
      <div className='investigator'>
        <div className='section-header'>
          <div className='section-title'>Investigator</div>
        </div>
      </div>
    )
  }
});

module.exports = InvestigatorSection;
