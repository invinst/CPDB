var React = require('react');

var ComplaintService = require('services/ComplaintService');
var ThreeNodesTimeline = require('components/ComplaintPage/InvestigationTimeline/ThreeNodesTimeline.react');
var TwoNodesTimeline = require('components/ComplaintPage/InvestigationTimeline/TwoNodesTimeline.react');
var Wrapper = require('components/Shared/Wrapper.react');


var InvestigationTimeline = React.createClass({
  propTypes: {
    info: React.PropTypes.object
  },

  renderTimeline: function (info, service) {
    if (service.startInvestigatingAtIncidentDate) {
      return (
        <TwoNodesTimeline info={ info } />
      );
    }

    return (
      <ThreeNodesTimeline info={ info } />
    );
  },

  render: function () {
    var info = this.props.info;
    var complaintService = ComplaintService(info);

    return (
      <Wrapper visible={ !complaintService.haveNoData } wrapperClass='investigation-timeline'>
        { this.renderTimeline(info, complaintService) }
      </Wrapper>
    );
  }
});

module.exports = InvestigationTimeline;
