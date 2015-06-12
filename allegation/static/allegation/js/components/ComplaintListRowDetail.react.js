
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var ComplaintListStore = require('../stores/ComplaintListStore');
var MapStore = require('../stores/MapStore');
var Officer = require("./Officer.react");
var ComplaintOfficerList = require("./ComplaintOfficerList.react");

var _timeline = false;

var ComplaintListRowDetail = React.createClass({
  getInitialState: function() {
    return {}

  },
  componentDidMount: function(){
    var allegation = this.props.complaint.allegation;
    if(!_timeline) {
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
        _timeline = new vis.Timeline(container, items, options);
      }
    }
    if(!('investigation' in this.state) && allegation.investigator_name){
      var that = this;
      $.getJSON('/api/investigation/', {'crid':allegation.crid}, function(data){

        that.setState(data)
      })
    }
  },
  renderMap: function(allegation){
    var map_div = <div>{address}</div>
    var address = <div>Exact Address Not Available</div>
    var hasLatlng = false;

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
        map_image = 'http://api.tiles.mapbox.com/v4/mapbox.streets/url-http%3A%2F%2Fdata.invisible.institute%2Fstatic%2F64x_map_marker.png(' + lng + ',' + lat + ')/' + lng + ',' + lat + ',13/489x300.png?access_token=' + token;
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
    return map_div

  },
  renderTimeline: function(allegation){
    var timeline = <div></div>
    if(allegation.start_date || allegation.incident_date || allegation.end_date){
      var timeline_dom_id = "timeline-" + allegation.crid;
      var timeline_div = <div id={timeline_dom_id}></div>
      timeline = <div className='row'>
                    <div className='col-md-3 '>
                      <strong className='title'>Timeline</strong>
                    </div>
                    <div className='col-md-9'>

                      {timeline_div}

                    </div>

                </div>
    }
    return timeline
  },
  renderInvestigation: function(allegation){
    var investigation = <div></div>;
    var rows = [];
    if(allegation.investigator) {
      if (this.state.investigation) {

        for (var i = 0; i < this.state.investigation.length; i++) {
          var investigation = this.state.investigation[i];

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

        var investigator = <div className='results'>{rows}</div>
        investigation = <div className='row margin-top'>
          <div className='col-md-3 investigation'>
            <strong className='title'>Investigator</strong>

            <div><span className='red line'></span>No Punishment</div>
            <div><span className='blue line'></span>Discipline Applied</div>
          </div>
          <div className='col-md-9 investigation'><span className='investigator-name'>{allegation.investigator_name}</span>
            {investigator}
          </div>
        </div>
      }
    }
    return investigation;
  },
  render: function(){
    var complaint = this.props.complaint;
    var allegation = complaint.allegation;
    var map_image = '';
    var category = {};
    var map_div = this.renderMap(allegation);
    var timeline = this.renderTimeline(allegation);
    var investigation = this.renderInvestigation(allegation);

    if(this.props.complaint.category){
      category = this.props.complaint.category;
    }

    var final_outcome = allegation.final_outcome ? allegation.final_outcome : "N/A";


    return  <div className="col-md-12 complaint_detail">
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
                  {timeline}
                  <div className='row margin-top'>
                    <div className='col-md-3'><strong className='title'>Disciplinary Action</strong></div>
                    <div className='col-md-9'>{final_outcome}</div>
                  </div>
                  {investigation}

                </div>
              </div>
            </div>
  },

  toggleComplaint: function(e){
    e.preventDefault();
    this.setState({'show':!this.state.show});
  },
});

module.exports = ComplaintListRowDetail
