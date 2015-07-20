var React = require('react');
var Summary = require('./Complaint/Summary.react');
var OfficerList = require('./Complaint/OfficerList.react');
var TimelineAndLocation = require('./Complaint/TimelineAndLocation.react');
var PoliceWitness = require('./Complaint/PoliceWitness.react');


var ComplaintListRowDetail = React.createClass({
  getInitialState: function () {
    return {investigation: 0};
  },
  setInvestigation: function(data) {
    this.setState(data);
  },
  componentDidMount: function () {
    if (this.state.investigation == 0) {
      $.getJSON('/api/investigation/', {'crid': this.props.complaint.allegation.crid}, this.setInvestigation);
    }
  },
  render: function () {
    var complaint = this.props.complaint;
    var infor = [<Summary key="summary" complaint={complaint} />];
    if (this.state.investigation) {
      infor.push(<OfficerList key="officer-list" complaint={complaint} investigation={this.state.investigation} />);
    }
    infor.push(<TimelineAndLocation key="timeline" complaint={complaint} />);

    if (this.state.police_witness && this.state.police_witness.length) {
      infor.push(<PoliceWitness key="police-witness" complaint={complaint} witnesses={this.state.police_witness} />)
    }

    return (
      <div className="row complaint_detail">
        <div className="col-md-12">
          {infor}
        </div>
      </div>
    );
  },

  toggleComplaint: function (e) {
    e.preventDefault();
    this.setState({'show': !this.state.show});
  }
});

module.exports = ComplaintListRowDetail;
