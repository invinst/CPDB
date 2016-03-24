var React = require('react');

var AgainstCard = require('components/ComplaintPage/AgainstSection/AgainstCard.react');
var InvestigationTimeline = require('components/ComplaintPage/AgainstSection/AgainstCard/InvestigationTimeline.react');
var Wrapper = require('components/Shared/Wrapper.react');
var CollectionUtil = require('utils/CollectionUtil');


var AgainstSection = React.createClass({
  propTypes: {
    allegation: React.PropTypes.object,
    officerAllegations: React.PropTypes.array
  },

  renderAgainstCard: function (shouldRenderTimelineOutside) {
    var allegation = this.props.allegation;

    return function (officerAllegation) {
      return (
        <AgainstCard key={ officerAllegation.id } allegation={ allegation }
          officerAllegation={ officerAllegation }
          shouldRenderTimelineOutside={ shouldRenderTimelineOutside } />
      );
    };
  },

  render: function () {
    var officerAllegations = this.props.officerAllegations || [];


    var officerAllegation = CollectionUtil.first(officerAllegations);
    var numberOfOfficerAllegations = officerAllegations.length || 1;
    var sameTimeline = CollectionUtil.isSameAllFields(officerAllegations, ['start_date', 'end_date']);
    var moreThanOneOfficer = numberOfOfficerAllegations > 1;
    var shouldRenderTimelineOutside = sameTimeline && moreThanOneOfficer;

    return (
      <div className='against-section'>
        <Wrapper visible={ shouldRenderTimelineOutside } wrapperClass='timeline'>
          <InvestigationTimeline allegation={ this.props.allegation } officerAllegation={ officerAllegation }/>
        </Wrapper>
        <div className='row section-header'>
          <span className='section-title bold pad'>Against ({ numberOfOfficerAllegations })</span>
        </div>
        { officerAllegations.map(this.renderAgainstCard(shouldRenderTimelineOutside)) }
      </div>
    );
  }
});

module.exports = AgainstSection;
