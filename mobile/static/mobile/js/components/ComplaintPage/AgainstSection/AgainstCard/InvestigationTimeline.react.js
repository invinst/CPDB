var React = require('react');

var AllegationPresenter = require('presenters/AllegationPresenter');
var OfficerAllegationPresenter = require('presenters/OfficerAllegationPresenter');
var ThreeNodesTimeline =
  require('components/ComplaintPage/AgainstSection/AgainstCard/InvestigationTimeline/ThreeNodesTimeline.react');
var TwoNodesTimeline =
  require('components/ComplaintPage/AgainstSection/AgainstCard/InvestigationTimeline/TwoNodesTimeline.react');
var Wrapper = require('components/Shared/Wrapper.react');


var InvestigationTimeline = React.createClass({
  propTypes: {
    allegation: React.PropTypes.object,
    officerAllegation: React.PropTypes.object
  },

  renderTimeline: function (startInvestigatingAtIncidentDate) {
    var TimelineComponent = startInvestigatingAtIncidentDate ? TwoNodesTimeline : ThreeNodesTimeline;

    return (
      <TimelineComponent allegation={ this.props.allegation } officerAllegation={ this.props.officerAllegation }/>
    );
  },

  render: function () {
    var presenter = OfficerAllegationPresenter(this.props.officerAllegation);
    var allegationPresenter = AllegationPresenter(this.props.allegation);
    var incidentDate = allegationPresenter.incidentDate;

    var startInvestigatingAtIncidentDate = presenter.startInvestigatingAt(incidentDate);

    return (
      <Wrapper visible={ presenter.haveEnoughDataForTimeline(incidentDate) }
        wrapperClass='investigation-timeline'>
        { this.renderTimeline(startInvestigatingAtIncidentDate) }
      </Wrapper>
    );
  }
});

module.exports = InvestigationTimeline;
