var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var ComplaintListStore = require('../stores/ComplaintListStore');
var MapStore = require('../stores/MapStore');
var Officer = require("./Officer.react");
var ComplaintOfficer = require("./ComplaintOfficer.react");
var ComplaintOfficerList = require("./ComplaintOfficerList.react");


var ComplaintListRowDetail = React.createClass({
  getInitialState: function () {
    return {
      timeline: null
    }

  },
  componentDidMount: function () {
    var allegation = this.props.complaint.allegation;
    if (!this.state.timeline) {
      var container = document.getElementById("timeline-" + allegation.id);
      if (container) {

        var items = [];
        var dateFormat = 'MMM DD, YYYY';
        if(allegation.incident_date == '1969-12-31 16:00:00' || allegation.incident_date == '1970-01-01 00:00:00-05'){
          allegation.incident_date = false;
        }
        var startDate, endDate;
        if (allegation.incident_date) {
          var incidentDate = moment(allegation.incident_date);
          var incidentDateHumanFormat = incidentDate.format(dateFormat);
          var content = '<div class="timeline-title">Incident Date</div><div class="timeline-date">' +
                        incidentDateHumanFormat + '</div>';
          items.push({
            id: 1,
            content: content,
            start: incidentDate
          });
          startDate = incidentDate;
          endDate = incidentDate;
        }
        if (allegation.start_date) {
          if(startDate){
            endDate = moment(allegation.start_date);
          }

          startDate = moment(allegation.start_date);
          var startDateHumanFormat = startDate.format(dateFormat);
          var content = '<div class="timeline-title">Investigation Start</div><div class="timeline-date start">' +
                        startDateHumanFormat + '</div>';
          items.push({
            id: 2,
            content: content,
            start: startDate
          });

        }
        if (allegation.end_date) {
          if(!startDate){
            startDate = moment(allegation.end_date);
          }
          endDate = moment(allegation.end_date);
          var endDateHumanFormat = endDate.format(dateFormat);
          var content = '<div class="timeline-title">Investigation End</div><div class="timeline-date end">' +
                        endDateHumanFormat + '</div>';
          items.push({
            id: 3,
            content: content,
            start: endDate,
            className: 'end'
          });
        }
        if (items)
        items = new vis.DataSet(items);

        // Configuration for the Timeline
        var options = {
          moveable: false,
          zoomable: false,
          margin: 15,
          showMinorLabels: false,
          format: {
            majorLabels: {
              millisecond: 'MMMM YYYY',
              second: 'MMMM YYYY',
              minute: 'MMMM YYYY',
              hour: 'MMMM YYYY',
              weekday: 'MMMM YYYY',
              day: 'MMMM YYYY',
              month: 'YYYY',
              year: ''
            }
          }
        };
        if(startDate && endDate) {
          options.start = moment(startDate).subtract(1, 'months');
          options.end = moment(endDate).add(1, 'months');
        }
        // Create a Timeline
       this.setState({
         timeline: new vis.Timeline(container, items, options)
       });
      }
    }

    if (!('investigation' in this.state)) {
      var that = this;
      $.getJSON('/api/investigation/', {'crid': allegation.crid}, function (data) {

        that.setState(data);
      });
    }
  },
  renderMap: function (allegation) {
    var map_div = "";
    var address = <div>Exact Address Not Available</div>;
    var hasLatlng = false;

    if (allegation.point.lat) {
      var token = MapStore.getToken();
      var lat = allegation.point.lat;
      var lng = allegation.point.lng;
      hasLatlng = true;
      if (allegation.add1 && allegation.add2) {
        map_image = 'http://api.tiles.mapbox.com/v4/mapbox.streets/pin-l-cross+482(' + lng + ',' + lat + ')/' + lng + ',' + lat + ',13/489x300.png?access_token=' + token;
        address = <div>
          <div>Location: {allegation.location}</div>
          <div>Address: {allegation.add1} {allegation.add2}</div>
          <div>City: {allegation.city}</div>
        </div>
      }
      else {
        map_image = 'http://api.tiles.mapbox.com/v4/mapbox.streets/url-http%3A%2F%2Fdata.invisible.institute%2Fstatic%2F64x_map_marker.png(' + lng + ',' + lat + ')/' + lng + ',' + lat + ',13/489x300.png?access_token=' + token;
      }
      map_div = <div className='row'>
        <div className='map col-md-6'>
          <img src={map_image}/>
        </div>
        <div className='col-md-5 col-md-offset-1'>
          {address}
        </div>
      </div>;
    }
    if(map_div){
      map_div = <div>
        <div className='row'>
          <div className='col-md-12'>
            <strong className='title'>Where</strong>
          </div>
        </div>
        {map_div}
      </div>
    }
    return map_div;

  },
  renderTimeline: function (allegation) {
    var timeline = '';
    if (allegation.start_date || allegation.incident_date || allegation.end_date) {
      var timeline_dom_id = "timeline-" + allegation.id;
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
    return timeline;
  },
  renderInvestigation: function (allegation) {
    var investigation = '';
    var rows = [];
    if (allegation.investigator) {
      if (this.state.investigation) {

        for (var i = 0; i < this.state.investigation.length; i++) {
          var investigation = this.state.investigation[i];

          var style = {
            'width': ( (investigation.count - investigation.no_action_taken_count) / investigation.count ) * 100 + "%"
          };
          var progressStyle = {
            width: 100 + "%"
          };
          rows.push(<div>
            <div>{investigation.officer.officer_first} {investigation.officer.officer_last} ({investigation.count}
              cases)
            </div>
            <div className="progress complaint" style={progressStyle}>
              <div className="progress-bar discipline" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                   aria-valuemax="100" style={style}>
                <span className="sr-only"></span>
              </div>
            </div>
          </div>)
        }

        var investigator = "";
        var legend = "";
        if (rows.length) {
          investigator = <div className='results'>
            <div><span className='investigator-name'>{allegation.investigator_name}</span></div>
            {rows}</div>;
          legend = <div>
            <div>
              <span className='red line'></span>No Punishment
            </div>
            <div>
              <span className='blue line'></span>Discipline Applied
            </div>
          </div>;
        }

        investigation = <div className='row margin-top'>
          <div className='col-md-3 investigation'>
            <strong className='title'>Investigator</strong>
            {legend}

          </div>
          <div className='col-md-9 investigation'>
            <div class='row-fluid'>{investigator}</div>
          </div>
        </div>
      }
    }
    return investigation;
  },
  renderPoliceWitness: function () {
    if (this.state.police_witness && this.state.police_witness.length) {

      var witness_rows = [];
      for (var i = 0; i < this.state.police_witness.length; i++) {
        var witness_obj = this.state.police_witness[i];
        var rows = [];
        for (var j = 0; j < witness_obj.officers.length; j++) {
          var officer_data = witness_obj.officers[j];
          var style = {
            'width': ((officer_data.num_complaints - officer_data.no_action_taken) / officer_data.num_complaints) * 100 + "%"
          };
          var progressStyle = {
            width: 100 + "%"
          };

          rows.push(<div>
            <div>{officer_data.officer.officer_first} {officer_data.officer.officer_last} ({officer_data.num_complaints}
              cases)
            </div>
            <div className="progress complaint" style={progressStyle}>
              <div className="progress-bar discipline" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                   aria-valuemax="100" style={style}>
                <span className="sr-only"></span>
              </div>
            </div>
          </div>)
        }
        witness_rows.push(<div>
          <div className='results'>
            <div
              className='investigator-name'>{witness_obj.witness_officer.officer_first} {witness_obj.witness_officer.officer_last}</div>
            {rows}</div>
        </div>)
      }

      var witness = <div className='row-fluid'>{witness_rows}</div>
      var legend = <div>
        <div>
          <span className='red line'></span>No Punishment
        </div>
        <div>
          <span className='blue line'></span>Discipline Applied
        </div>
      </div>;

      return <div className='row margin-top'>
        <div className='col-md-3 investigation'>
          <strong className='title'>Police Witness</strong>
          {legend}
        </div>
        <div className="col-md-9 investigation">
          {witness}
        </div>
      </div>
    }
    return '';
  },
  renderWitness: function () {
    if (this.state.complaint_witness && this.state.complaint_witness.length) {
      var rows = [];

      for (var i = 0; i < this.state.complaint_witness.length; i++) {
        var num = i + 1;
        rows.push(<div>Witness {num}: Race {this.state.complaint_witness[i].race}
          Gender {this.state.complaint_witness[i].gender}</div>);
      }

      return <div className='row margin-top'>
        <div className='col-md-3 investigation'>
          <strong className='title'>Complaining Witness</strong>
        </div>
        <div className="col-md-9">
          {rows}
        </div>
      </div>
    }
    return '';
  },
  render: function () {
    var complaint = this.props.complaint;
    var allegation = complaint.allegation;
    var category = {};
    var map_div = this.renderMap(allegation);
    var timeline = this.renderTimeline(allegation);
    var investigation = this.renderInvestigation(allegation);
    var police_witness = this.renderPoliceWitness();
    var witness = this.renderWitness();

    if (complaint.category) {
      category = complaint.category;
    }
    var officerLabel = "Officer Involved";
    var officersInvolved = [];
    if (complaint.officers.length > 0){
      officerLabel = "Officers Involved";
      for(var i=0; i < complaint.officers.length; i++) {
        officersInvolved.push(<div className='col-md-4'><ComplaintOfficer key={i} officer={complaint.officers[i]}/></div>)
      }
    }

    var againstOfficer = '';
    if (complaint.officer) {
      againstOfficer = <div className="row">
        <div className='col-md-12'>
          <h4>{officerLabel}</h4>
        </div>
        <div className='col-md-12'>
          <div className='col-md-4'><ComplaintOfficer officer={complaint.officer} /></div> {officersInvolved}
        </div>
      </div>
    }

    var final_outcome = '';
    if (allegation.final_outcome) {
      final_outcome = <div className='row margin-top'>
        <div className='col-md-3'><strong className='title'>Disciplinary Action</strong></div>
        <div className='col-md-9'>{allegation.final_outcome}</div>
      </div>
    }

    var investigationHeader = '';
    if (timeline || final_outcome || investigation || police_witness || witness ) {
      investigationHeader = <div className='row margin-top'>
        <div className='col-md-12'>
          <h4>Investigation</h4>
        </div>
      </div>;
    }

    return <div className="col-md-12 complaint_detail">
      <div className="row-fluid">
        <div className="col-md-12">
          <div className='row'>
            <div className="col-md-12">
              <h3>{category.cat_id} {category.allegation_name}</h3>
            </div>
          </div>
          {againstOfficer}
          {map_div}
          {investigationHeader}
          {timeline}
          {final_outcome}
          {investigation}
          {police_witness}
          {witness}
        </div>
      </div>
    </div>
  },

  toggleComplaint: function (e) {
    e.preventDefault();
    this.setState({'show': !this.state.show});
  }
});

module.exports = ComplaintListRowDetail
