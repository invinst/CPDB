var React = require('react');
var MapStore = require("../stores/MapStore");
var FilterActions = require("../actions/FilterActions");
var Timeline = require("./Timeline.react");


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


function donutChart(data){

    var layout = function(original) {
        var complaintLayout = d3.layout.pie()
            .value(function(d) { return d[0] + d[1]; })
            .sort(null);

        var data = complaintLayout(original);

        for (var i in data) {
            var thisComplaintType = data[i];

            var disciplineLayout = d3.layout.pie()
                .value(function(d) { return d; })
                .sort(null)
                .startAngle(thisComplaintType.startAngle)
                .endAngle(thisComplaintType.endAngle);

            thisComplaintType.disciplined = disciplineLayout(thisComplaintType.data)[0];
            thisComplaintType.undisciplined = disciplineLayout(thisComplaintType.data)[1];
        }

        return data;
    };

    var arc = function(data, innerR, outerR) {
        var arcFunc = d3.svg.arc()
            .innerRadius(innerR)
            .outerRadius(outerR)
            .startAngle(data.startAngle)
            .endAngle(data.endAngle);

        return arcFunc(data);
    };

    // Prepare to draw
    var preparedData = layout(data);
    var canvas = d3.select("#dis-compl .chart").append("svg")
        .attr("width", 400)
        .attr("height", 400);
    var chart = canvas.append("g")
        .attr("transform", "translate(" + canvas.attr("width")/2 + "," + canvas.attr("height")/2 + ")");

    // Each 'sector' is a circular sector that binds data associated with a type of complaint
    // Each sector is grouped under a <g>
    var sector = chart.selectAll("g")
        .data(preparedData)
        .enter().append("g")
            .attr("class", "sector");

    // Complaint group
    var complaintG = sector.append("g").attr("class", "complaint");
    // Draw the outer circular sector that represents the number of complaints per type
    complaintG.append("path")
            .attr("d", function(d) { return arc(d, 90, 120); })
            .attr("class", function(d, i) { return "complaint-" + i; });

    // Discipline group
    var disciplineG = sector.append("g").attr("class", "discipline");
    // Draw the inner circular sector that represents the number of disciplined complaints per type
    disciplineG.append("path")
            .attr("d", function(d) { return arc(d.disciplined, 75, 89); })
            .attr("class", "disciplined");
    // Draw the inner circular sector that represents the number of undisciplined complaints per type
    disciplineG.append("path")
            .attr("d", function(d) { return arc(d.undisciplined, 75, 89); })
            .attr("class", "undisciplined");
}


var OfficerDetail = React.createClass({
  getInitialState: function() {
     return {}
  },
  componentDidMount: function() {
    FilterActions.replaceFilters([{
        value: ['officer', this.props.officer.id]
    }]);

  },
  render: function(){
    var officer = this.props.officer;
    var complaintRate = 'below';
    var complaintRateLabel = 'Below the average complaint rate';
    if(officer.allegations_count > 20){
      complaintRate = 'above';
      complaintRateLabel = 'Above the average complaint rate';
    }
    var rank = "";
    var rank_display = ranks[officer.rank];
    if(rank_display){
        rank = <td><span className="title">Rank</span> {rank_display}</td>;
    }
    var star = "";
    if(officer.star){
      star = <td><span className="title">Star</span> {officer.star}</td>;
    }
    var appt_date = "";
    if(officer.appt_date) {
      appt_date = <td><span className="title">Joined</span> {officer.appt_date}</td>;
    }
    var race = "";
    if(officer.rage){
      race = <td><span className="title">Race</span> {officer.race}</td>;
    }
    var gender_display = '';
    if (officer.gender){
      gender_display = officer.gender == 'M' ? 'Male' : 'Female';
      gender_display = <td><span className="title">Gender</span> {gender_display}</td>
    }
    return <div id='OfficerDetail' className={complaintRate}>
              <div className='row'>
                  <div className="col-md-9 h3">
                      <span className="star">{officer.star}</span>
                      {officer.officer_first} {officer.officer_last}
                  </div>
                  <div className='col-md-3 complaint-rate-label'>{complaintRateLabel}</div>
              </div>

              <div className='row'>
                  <div className="col-md-12 information">
                      <table className="pull-right">
                          <tr>
                              <td><span className="title">Unit</span> {officer.unit}</td>
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
                <div className="col-md-4">
                  <Timeline officer={officer} />
                </div>
              </div>
          </div>
  },

});

module.exports = OfficerDetail
