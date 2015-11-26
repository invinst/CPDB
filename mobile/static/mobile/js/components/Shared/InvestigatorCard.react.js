var React = require('react');
var ProgressBar = require('components/Shared/ProgressBar.react');

var InvestigatorCard = React.createClass({
  render: function () {
    return (
      <div className='investigator-card'>
          <div className='name'>John Angelopoulos</div>
          <div className='description'>Unit 121, LIEUTENANT OF POLICE</div>
          <div className='analysis'>345 discipllned out of 743 cases</div>
          <div className='investigation-overall'>
              <ProgressBar value={345} total={743}/>
          </div>
        </div>
    )
  }
});

module.exports = InvestigatorCard;
