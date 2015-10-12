var React = require('react');
var Summary = require('components/DataToolPage/Complaint/Summary.react');
var OfficerList = require('components/DataToolPage/Complaint/OfficerList.react');
var TimelineAndLocation = require('components/DataToolPage/Complaint/TimelineAndLocation.react');
var PoliceWitness = require('components/DataToolPage/Complaint/PoliceWitness.react');
var RequestButton = require('components/DataToolPage/Complaint/RequestButton.react');


var Complaint = React.createClass({
  getInitialState: function () {
    return {police_witness: 0};
  },
  setInvestigation: function(data) {
    this.setState(data);
  },
  componentDidMount: function () {
    if (this.state.police_witness == 0) {
      $.getJSON('/api/investigation/', {'crid': this.props.complaint.allegation.crid}, this.setInvestigation);
    }
  },
  render: function () {
    var complaint = this.props.complaint;
    var infor = [<Summary key="summary" complaint={complaint} />];

    infor.push(<OfficerList key="officer-list" complaint={complaint} />);
    infor.push(<TimelineAndLocation key="timeline" complaint={complaint} />);

    if (this.state.police_witness && this.state.police_witness.length) {
      infor.push(<PoliceWitness key="police-witness" complaint={complaint} witnesses={this.state.police_witness} />)
    }

    var cssClasses = "row-fluid complaint_detail clearfix slide-down" + (this.props.hide ? ' closed' : '');
    var buttons = '';
    if (!this.props.noButton) {
      buttons = (
        <div className="col-md-10 col-md-offset-1 button-list">
          <RequestButton complaint={complaint} />
          <button type="button" className="btn btn-close" onClick={this.toggleComplaint}>
            <i className="fa fa-times" /> Close
          </button>
        </div>
      );
    }
    return (
      <div className={cssClasses}>
        <div className="col-md-12">
          {infor}
        </div>
        {buttons}
      </div>
    );
  },

  toggleComplaint: function (e) {
    $(e.target).parents(".complaint-row").trigger('closeAction');
  }
});

module.exports = Complaint;
