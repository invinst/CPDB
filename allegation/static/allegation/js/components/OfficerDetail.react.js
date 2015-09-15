var React = require('react');
var MapStore = require("../stores/MapStore");
var FilterActions = require("../actions/FilterActions");
var Timeline = require("./Officer/Timeline.react");
var Map = require("./Officer/Map.react");
var DonutChart = require("./Officer/DonutChart.react");
var OfficerMixin = require("./Officer/OfficerMixin.react");


var ranks = {
  'PO': 'Police Officer',
  'LT': 'Lieutenant',
  'ET': 'Evidence Technician',
  'DET': 'Detective',
  'FTO': 'Field Training Officer',
  'Cpt': 'Captain',
  'SGT': 'Sergeant',
  'CMDR': 'Commander',
  'Agent': 'Agent',
  'Chief': 'Chief',
  '': 'N/A'
};


var OfficerDetail = React.createClass({
  mixins: [OfficerMixin],
  getInitialState: function () {
    return {}
  },
  componentDidMount: function () {
  },

  render: function () {
    var officer = this.props.officer;
    var complaintRate = this.getAvgClass();
    var complaintRateLabel = 'Below the average complaint rate';
    if (officer.allegations_count > 20) {
      complaintRateLabel = 'Above the average complaint rate';
    }
    var rank = "";
    var rank_display = ranks[officer.rank];
    if (rank_display) {
      rank = <td><span className="title">Rank</span> {rank_display}</td>;
    }
    var star = "";
    if (officer.star) {
      star = <td><span className="title">Star</span> {officer.star}</td>;
    }
    var appt_date = "";
    if (officer.appt_date) {
      appt_date = <td><span className="title">Joined</span> {officer.appt_date}</td>;
    }
    var race = "";
    if (officer.rage) {
      race = <td><span className="title">Race</span> {officer.race}</td>;
    }
    var gender_display = '';
    if (officer.gender) {
      gender_display = officer.gender == 'M' ? 'Male' : 'Female';
      gender_display = <td><span className="title">Sex</span> {gender_display}</td>
    }
    var unit = "";
    if (officer.unit) {
      unit = <td><span className="title">Unit</span> {officer.unit}</td>
    }

    var unit = "";
    if (officer.unit) {
      unit = <td><span className="title">Unit</span> {officer.unit}</td>
    }

    var mapStyle = {
      height: '240px'
    };
    var columnClass = showMap ? "col-md-4" : "col-md-6";
    var mapDiv = "";
    var radius = 8;
    if(showMap){
      var options = {
        defaultZoom: 10,
        maxZoom: 15,
        minZoom: 8,
        scrollWheelZoom: false
      };
      mapDiv = (
        <div className={columnClass}>
          <Map officer={officer} style={mapStyle} radius={radius} options={options} />
        </div>
      );
    }
    return (
      <div id='OfficerDetail' className={complaintRate}>
        <div className='row'>
          <div className="col-md-9 h3">
            <span className="star">{officer.star}</span>
            {officer.officer_first} {officer.officer_last}
          </div>
          <div className='col-md-3 tright complaint-rate-label'>{complaintRateLabel}</div>
        </div>

        <div className='row'>
          <div className="col-md-12 information">
            <table className="pull-right">
              <tr>
                {unit}
                {rank}
                {star}
                {appt_date}
                {gender_display}
                {race}
              </tr>
            </table>
          </div>
        </div>
        <div className="row">
          {mapDiv}
          <div className={columnClass}>
            <Timeline officer={officer}/>
          </div>
          <div className={columnClass}>
            <DonutChart officer={officer}/>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = OfficerDetail;
