var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var ComplaintListStore = require('../stores/ComplaintListStore');
var MapStore = require('../stores/MapStore');
var SessionStore = require('../stores/SessionStore');
var Officer = require("./Officer.react");
var Complaint = require("./Complaint.react");
var RequestButton = require('./Complaint/RequestButton.react');
var _timeline = false;
var init_data = typeof(INIT_DATA) != 'undefined' && INIT_DATA ? INIT_DATA : {'opened_complaints':[]};



var ComplaintListRow = React.createClass({
  getInitialState: function () {
    init_data['opened_complaints'] = init_data['opened_complaints'] || [];
    return {
      'show': init_data['opened_complaints'].indexOf(this.props.complaint.allegation.id) != -1,
      'detail': {}
    }
  },

  componentDidMount: function () {
    $(this.getDOMNode()).on("closeAction", this.toggleComplaint);
  },

  detailRendered: function() {
     return this.state.show || this.state.hasShown;
  },

  detailIsCurrentlyShown: function() {
     return !this.state.show && this.state.hasShown;
  },

  render: function () {
    var complaint = this.props.complaint;
    var caretClasses = 'fa fa-chevron-right';
    var detailIsShown = this.detailIsCurrentlyShown();
    var showMore = '';

    if (this.detailRendered()) {
      showMore = <Complaint complaint={complaint} hide={detailIsShown}/>;
      caretClasses = 'fa fa-chevron-' + (detailIsShown ? 'right' : 'down');
    }

    var allegation = complaint.allegation;
    var category = {};
    if (this.props.complaint.category) {
      category = this.props.complaint.category;
    }
    var officerName = "";
    if (complaint.officer) {
      officerName = complaint.officer.officer_first + " " + complaint.officer.officer_last;
      if(complaint.officers.length > 0){
        officerName += " and " + complaint.officers.length + " more";
      }
    }
    if(allegation.incident_date && moment(allegation.incident_date).year() <= 1970){
      allegation.incident_date = false;
    }
    var date_label = "Incident Date";
    var date = allegation.incident_date_only;
    if(!allegation.incident_date && allegation.start_date) {
      date = allegation.start_date;
      date_label = "Investigation Start";
    }
    var finding = this.props.finding ? this.props.finding.replace(/ /,"-").toLowerCase() : 'other';
    caretClasses = caretClasses + " complaint-row-outcome " + finding;
    var rowClassName = 'complaint-row ' + finding;
    if (allegation.final_outcome_class == 'disciplined') {
      rowClassName += ' disciplined';
    }

    return (
      <div className={rowClassName}>
        <div className='row cursor' onClick={this.toggleComplaint}>
          <div className='col-md-1 text-center'>
            <i className={caretClasses}></i>
          </div>
          <div className='col-md-3'>
            <div className='title'>Misconduct</div>
            {category.category}
          </div>
          <div className='col-md-1'>
            <div className='title'>CRID</div>
            {allegation.crid}
          </div>
          <div className='col-md-2'>
            <div className='title'>{date_label}</div>
            {date}
          </div>
          <div className='col-md-3'>
            <div className='title'>Officer</div>
            {officerName}
          </div>
          <div className='col-md-2'>
            <RequestButton complaint={complaint} />
          </div>

        </div>
        {showMore}
      </div>
    );
  },

  toggleComplaint: function (e) {
    var openedComplaints = init_data['opened_complaints'];
    var id = this.props.complaint.allegation.id
    if (this.state.show) {
      openedComplaints.splice(openedComplaints.indexOf(id), 1);
    } else {
      openedComplaints.push(id);
    }
    this.setState({
      show: !this.state.show,
      hasShown: true
    });


    SessionStore.saveSession({
      opened_complaints: init_data['opened_complaints']
    })
  }
});

module.exports = ComplaintListRow;
