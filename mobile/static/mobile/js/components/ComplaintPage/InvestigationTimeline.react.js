var React = require('react');

var AllegationResourceUtil = require('utils/AllegationResourceUtil');
var ComplaintPresenter = require('presenters/ComplaintPresenter');
var ComplaintService = require('services/ComplaintService');
var HelperUtil = require('utils/HelperUtil');
var ThreeNodesTimeline = require('components/ComplaintPage/InvestigationTimeline/ThreeNodesTimeline.react');
var TwoNodesTimeline = require('components/ComplaintPage/InvestigationTimeline/TwoNodesTimeline.react');


var InvestigationTimeline = React.createClass({
  render: function (){
    var info = this.props.info;
    var complaintService = ComplaintService(info);

    if (complaintService.haveNoData) {
      return (<div></div>);
    }

    if (complaintService.startInvestigatingAtIncidentDate) {
      return (
        <div className='investigation-timeline'>
          <TwoNodesTimeline info={info} />
        </div>
      );
    }

    return (
      <div className='investigation-timeline'>
        <ThreeNodesTimeline  info={info} />
      </div>
    );
  }
});

module.exports = InvestigationTimeline;
