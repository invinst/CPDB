var React = require('react');
var PropTypes = React.PropTypes;

var Summary = require('components/DataToolPage/Complaint/Summary.react');
var OfficerList = require('components/DataToolPage/Complaint/OfficerList.react');
var TimelineAndLocation = require('components/DataToolPage/Complaint/TimelineAndLocation.react');
var PoliceWitness = require('components/DataToolPage/Complaint/PoliceWitness.react');
var ComplaintListActions = require('actions/ComplaintList/ComplaintListActions');
var SessionAPI = require('utils/SessionAPI');


var Complaint = React.createClass({
  propTypes: {
    complaint: PropTypes.object,
    hide: PropTypes.bool,
    noButton: PropTypes.bool
  },

  getInitialState: function () {
    return {policeWitness: 0};
  },
  componentDidMount: function () {
    if (this.state.policeWitness == 0) {
      $.getJSON('/api/police-witness/', {'crid': this.props.complaint.allegation.crid}, this.setInvestigation);
    }
  },
  setInvestigation: function (data) {
    this.setState(data);
  },
  toggleComplaint: function (e) {
    ComplaintListActions.toggleComplaint(this.props.complaint.allegation.id);
    SessionAPI.updateSessionInfo({'query': { activeComplaints: this.state.activeComplaints}});
  },

  render: function () {
    var complaint = this.props.complaint;
    var infor = [<Summary key='summary' complaint={ complaint } />];
    var cssClasses, buttons;

    infor.push(<OfficerList key='officer-list' complaint={ complaint } />);
    infor.push(<TimelineAndLocation key='timeline' complaint={ complaint } />);

    if (this.state.policeWitness && this.state.policeWitness.length) {
      infor.push(<PoliceWitness key='police-witness' complaint={ complaint } witnesses={ this.state.policeWitness } />);
    }

    cssClasses = 'row-fluid complaint_detail clearfix slide-down' + (this.props.hide ? ' closed' : '');
    buttons = '';
    if (!this.props.noButton) {
      // this component seems to be deprecated, I will remove this after confirming with others
      buttons = (
        <div className='col-md-10 col-md-offset-1 button-list'>
          <button type='button' className='btn btn-close' onClick={ this.toggleComplaint }>
            <i className='fa fa-times' /> Close
          </button>
        </div>
      );
    }
    return (
      <div className={ cssClasses }>
        <div className='col-md-12'>
          { infor }
        </div>
        { buttons }
      </div>
    );
  }
});

module.exports = Complaint;
