
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var ComplaintListStore = require('../stores/ComplaintListStore');
var MapStore = require('../stores/MapStore');
var Officer = require("./Officer.react");
var ComplaintOfficerList = require("./ComplaintOfficerList.react");

var _timeline = false;

var ComplaintListRow = React.createClass({
  getInitialState: function() {
    // TODO: save state of show in a store
    return {
      'show': false,
      'detail': {}
    }

  },
  componentDidUpdate: function(){
    var allegation = this.props.complaint.allegation;
    if(this.state.show && !_timeline) {

      var container = document.getElementById('timeline-' + allegation.crid);
      if(container) {

        var items = [];
        if (allegation.incident_date) {
          incident_date = allegation.incident_date.split(" ")[0];
          items.push({id: 1, content: '<div class="timeline-title">Incident Date</div><div class="timeline-date">' + incident_date + '</div>', start: incident_date});
        }
        if (allegation.start_date) {
          items.push({id: 2, content: '<div class="timeline-title">Investigation Start</div><div class="timeline-date start">' + allegation.start_date + '</div>', start: allegation.start_date});
        }
        if (allegation.end_date) {
          items.push({id: 3, content: '<div class="timeline-title">Investigation End</div><div class="timeline-date end">' + allegation.end_date + '</div>', start: allegation.end_date});
        }

        items = new vis.DataSet(items);

        // Configuration for the Timeline
        var options = {};

        // Create a Timeline
        var _timeline = new vis.Timeline(container, items, options);
      }
    }


    if(this.state.show && !('investigation' in this.state) && allegation.investigator.length){
      var that = this;
      $.getJSON('/api/investigation/', {'crid':allegation.crid}, function(data){

        that.setState(data)
      })
    }
  },

  render: function(){
    var complaint = this.props.complaint;
    var icon = 'fa fa-caret-down';
    var show_more = 'hidden';
    var allegation = complaint.allegation;
    var map_image = '';
    var category = {};
    if(this.state.show){
      icon = 'fa fa-caret-up';
      show_more = 'col-md-12 complaint_detail';
      var address = <div>Exact Address Not Available</div>
      var hasLatlng = false;
      var map_div = <div>{address}</div>
      if(allegation.point.lat){
        var token = MapStore.getToken();
        var lat = allegation.point.lat;
        var lng = allegation.point.lng;
        hasLatlng = true;
        if(allegation.add1 && allegation.add2) {
          map_image = 'http://api.tiles.mapbox.com/v4/mapbox.streets/pin-l-cross+482(' + lng + ',' + lat + ')/' + lng + ',' + lat + ',13/489x300.png?access_token=' + token;
          address =   <div>
                        <div>Location: {allegation.location}</div>
                        <div>Address: {allegation.add1} {allegation.add2}</div>
                        <div>City: {allegation.city}</div>
                      </div>
        }
        else{
          map_image = 'http://api.tiles.mapbox.com/v4/mapbox.streets/pin-l-park+482(' + lng + ',' + lat + ')/' + lng + ',' + lat + ',13/489x300.png?access_token=' + token;
        }
        map_div = <div className='row'>
                    <div className='map col-md-6'>
                      <img src={map_image} />
                    </div>
                    <div className='col-md-5 col-md-offset-1'>
                      {address}
                    </div>
                  </div>

      }
    }
    if(allegation.start_date || allegation.incident_date || allegation.end_date){
      var timeline_dom_id = "timeline-" + allegation.crid;
      var timeline_div = <div id={timeline_dom_id}></div>
    }
    var officerName = [];
    for(var i = 0; i < complaint.officers.length; i++){
      var officer = complaint.officers[i];
      officerName.push(officer.officer_first + " " + officer.officer_last);
    }
    officerName = officerName.join(", ");

    if(this.props.complaint.category){
      category = this.props.complaint.category;
    }
    rows = []
    if(this.state.investigation){

      for(var i=0; i<this.state.investigation.length; i++) {
        var investigation = this.state.investigation[i];
        console.log(investigation)

        var style = {
          'width': ( (investigation.count - investigation.no_action_taken_count) / investigation.count ) * 100 + "%"
        }
        var progressStyle = {
          width: 100 + "%"
        };
        rows.push(<div>
                    <div>{investigation.officer.officer_first} {investigation.officer.officer_last} ({investigation.count} cases)
                    </div>
                    <div className="progress complaint" style={progressStyle}>
                      <div className="progress-bar discipline" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                           aria-valuemax="100" style={style}>
                        <span className="sr-only"></span>
                      </div>
                    </div>
                  </div>)
      }
    }
    var investigator = <div className='results'>{rows}</div>


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

            <div className={show_more}>
              <div className="row-fluid">
                <div className="col-md-12">
                  <div className='row'>
                    <div className="col-md-12">
                      <h3>{category}</h3>
                      {category.cat_id} {category.allegation_name}
                    </div>
                    <div className='col-md-12'>
                      <h4>Officers Involved</h4>
                    </div>
                    <div>
                      <div className='col-md-12'>
                        <ComplaintOfficerList officers={complaint.officers} />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                      <div className='col-md-12'>
                        <strong className='title'>Where</strong>
                      </div>
                  </div>
                  {map_div}
                  <div className='row margin-top'>
                    <div className='col-md-12'>
                      <h4>Investigation</h4>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-3 '>
                      <strong className='title'>Timeline</strong>
                    </div>
                    <div className='col-md-9'>

                      {timeline_div}

                    </div>

                  </div>
                  <div className='row margin-top'>
                    <div className='col-md-3'><strong className='title'>Disciplinary Action</strong></div>
                    <div className='col-md-9'>{allegation.final_outcome}</div>
                  </div>
                  <div className='row margin-top'>
                    <div className='col-md-3 investigation'>
                        <strong className='title'>Investigator</strong>
                        <div><span className='red line'></span>No Punishment</div>
                        <div><span className='blue line'></span>Discipline Applied</div>
                    </div>
                    <div className='col-md-9 investigation'>{allegation.investigator}
                      {investigator}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  },

  toggleComplaint: function(e){
    e.preventDefault();
    this.setState({'show':!this.state.show});
  },
});

module.exports = ComplaintListRow
