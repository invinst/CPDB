var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var ComplaintListStore = require('../stores/ComplaintListStore');
var MapStore = require('../stores/MapStore');
var Officer = require("./Officer.react");
var ComplaintOfficerList = require("./ComplaintOfficerList.react");
var ComplaintListRowDetail = require("./ComplaintListRowDetail.react");
var _timeline = false;

var ComplaintListRow = React.createClass({
  getInitialState: function () {
    // TODO: save state of show in a store
    return {
      'show': false,
      'detail': {}
    }

  },

  render: function () {
    var complaint = this.props.complaint;
    var caretClasses = 'fa fa-caret-down fa-stack-1x fa-inverse';

    var showMore = '';
    if (this.state.show) {
      showMore = <ComplaintListRowDetail complaint={complaint}/>
      caretClasses = 'fa fa-caret-right fa-stack-1x fa-inverse';
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

    var date_label = "Incident Date";
    var date = allegation.incident_date;
    if(!allegation.incident_date && allegation.start_date) {
      date = allegation.start_date;
      date_label = "Investigation Start";
    }
    var finding = "fa fa-circle fa-stack-2x " + this.props.finding;
    var documentLabel = "Request";
    var documentLink = <a className='btn btn-sm btn-request btn-full-width' href="#">
      <i className='fa fa-file-pdf-o'></i> {documentLabel}
    </a>;
    if (allegation.document_id) {
      documentLabel = "Download";
      var link = "http://s3.documentcloud.org/documents/" +
                  allegation.document_id + "/" + allegation.document_normalized_title +".pdf";
      documentLink = <a className='btn btn-sm btn-request btn-full-width' href={link}>
        <i className='fa fa-file-pdf-o'></i> {documentLabel}
      </a>
    }

    return <div className="complaint-row">
      <div className='row cursor' onClick={this.toggleComplaint}>
        <div className='col-md-1'>
                <span className="fa-stack fa-lg">
                  <i className={finding}></i>
                  <i className={caretClasses}></i>
                </span>
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

  toggleComplaint: function(e){
    if (e.target.tagName.toLowerCase() == 'span' && $(e.target).text().toLowerCase() == 'download') {
      return;
    }
    e.preventDefault();
    this.setState({'show': !this.state.show});
  }
});

module.exports = ComplaintListRow;
