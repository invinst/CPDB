var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var ComplaintListStore = require('../stores/ComplaintListStore');
var MapStore = require('../stores/MapStore');
var FilterStore = require('../stores/FilterStore');
var Officer = require("./Officer.react");
var ComplaintOfficerList = require("./ComplaintOfficerList.react");
var ComplaintListRowDetail = require("./ComplaintListRowDetail.react");
var _timeline = false;
var init_data = !INIT_DATA ? {'opened_complaints':[]} : INIT_DATA;


var ComplaintListRow = React.createClass({
  getInitialState: function () {
    init_data['opened_complaints'] =  init_data['opened_complaints'] || [];
    return {
      'show': init_data['opened_complaints'].indexOf(this.props.complaint.allegation.id) != -1,
      'detail': {}
    }
  },

  render: function () {
    var complaint = this.props.complaint;
    var caretClasses = 'fa fa-chevron-right';

    var showMore = '';
    if (this.state.show) {
      showMore = <ComplaintListRowDetail complaint={complaint}/>
      caretClasses = 'fa fa-chevron-down';
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
    caretClasses = caretClasses + " complaint-row-outcome " + this.props.finding;
    var documentLabel = "Request";
    var documentLink = <a className='btn btn-sm btn-request ' href="#">
      <i className='fa fa-file-pdf-o'></i> {documentLabel}
    </a>;
    if (allegation.document_id) {
      documentLabel = "View Document";
      var link = "http://documentcloud.org/documents/" +
                  allegation.document_id + "-" + allegation.document_normalized_title +".html";
      documentLink = <a className='btn btn-sm btn-request ' href={link} target="_blank">
        <i className='fa fa-download'></i> {documentLabel}
      </a>
    }

    return <div className="complaint-row">
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
          {documentLink}
        </div>

      </div>
      {showMore}
    </div>


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
      show: !this.state.show
    });


    FilterStore.saveSession({
      opened_complaints: init_data['opened_complaints']
    })
  }
});

module.exports = ComplaintListRow;
