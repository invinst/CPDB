var React = require('react');

var Wrapper = require('components/Shared/Wrapper.react');
var HelperUtil = require('utils/HelperUtil');

var InvestigatorSection = React.createClass({
  propTypes: {
    allegation: React.PropTypes.object
  },

  renderInvestigator: function (investigator) {
    var currentRank = HelperUtil.fetch(investigator, 'current_rank', 'Rank unknown');

    return (
      <div className='investigator-card pad'>
        <div className='row'>
          <div className='one column circle-wrapper center'>
            <div className='small-circle background-black circle'></div>
          </div>
          <div className='eleven columns'>
            <div className='investigator'>
              <div className='name bold'>{ investigator['name'] }</div>
              <div className='rank'>{ currentRank }</div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  render: function () {
    var investigator = HelperUtil.fetch(this.props.allegation, 'investigator', false);

    return (
      <Wrapper wrapperClass='investigator-section' visible={ !!investigator }>
        <div className='row section-header'>
          <span className='section-title bold pad'>Investigator</span>
        </div>
        { this.renderInvestigator(investigator) }
      </Wrapper>
    );
  }
});

module.exports = InvestigatorSection;
