var React = require('react');

var AllegationResourceUtil = require('utils/AllegationResourceUtil');
var ComplaintPresenter = require('presenters/ComplaintPresenter');
var ComplaintService = require('services/ComplaintService');
var HelperUtil = require('utils/HelperUtil');
var ThreeNodesTimeline = require('components/ComplaintPage/InvestigationTimeline/ThreeNodesTimeline.react');
var TwoNodesTimeline = require('components/ComplaintPage/InvestigationTimeline/TwoNodesTimeline.react');
var Wrapper = require('components/Shared/Wrapper.react');


var InvestigationTimeline = React.createClass({
  renderTimeline: function (info, service) {
     if (service.startInvestigatingAtIncidentDate) {
      return (
        <TwoNodesTimeline info={info} />
      );
    }

    return (
      <ThreeNodesTimeline  info={info} />
    );
  },

  render: function() {
    var info = this.props.info;
    var complaintService = ComplaintService(info);

    return (
      <Wrapper visible={!complaintService.haveNoData} wrapperClass='investigation-timeline'>
        {this.renderTimeline(info, complaintService)}
      </Wrapper>
    );
  }
});

module.exports = InvestigationTimeline;
