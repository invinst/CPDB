
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
  getInitialState: function() {
    // TODO: save state of show in a store
    return {
      'show': false,
      'detail': {}
    }

  },

  render: function(){
    var complaint = this.props.complaint;
    var icon = 'fa fa-caret-down';
    var showMore = '';
    if(this.state.show) {
      showMore = <ComplaintListRowDetail complaint={complaint} />
      icon = 'fa fa-caret-up';
    }
    var allegation = complaint.allegation;
    var category = {};
    var officerName = [];
    for(var i = 0; i < complaint.officers.length; i++){
      var officer = complaint.officers[i];
      officerName.push(officer.officer_first + " " + officer.officer_last);
    }
    officerName = officerName.join(", ");


    return <div className="complaint-row">
            <div className='row'>
              <div className='col-md-1'>
                <i className='fa fa-check'></i>
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
                <div className='title'>Incident Date</div>
                {allegation.incident_date}
              </div>
              <div className='col-md-3'>
                <div className='title'>Officer</div>
                {officerName}
              </div>
              <div className='col-md-1'>
                <a className='btn btn-sm btn-request'>
                  <i className='fa fa-file-pdf-o'></i>&nbsp;&nbsp;&nbsp;Request
                </a>
              </div>
              <div className='col-md-1 text-center' >
                <a onClick={this.toggleComplaint} href="#" className="show_more"><i className={icon}></i></a>
              </div>
            </div>
          {showMore}
          </div>


  },

  toggleComplaint: function(e){
    e.preventDefault();
    this.setState({'show':!this.state.show});
  },
});

module.exports = ComplaintListRow
