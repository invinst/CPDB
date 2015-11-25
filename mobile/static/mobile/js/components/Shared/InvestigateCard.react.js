var React = require('react');


var InvestigateCart = React.createClass({
  render: function () {
    return (
      <div className='investigator-card'>
          <div className='name'>John Angelopoulos</div>
          <div className='description'>Unit 121, LIEUTENANT OF POLICE</div>
          <div className='analysis'>345 discipllned out of 743 cases</div>
          <div className='progress-bar'>------Progress bar----</div>
        </div>
    )
  }
});

module.exports = InvestigateCart;
