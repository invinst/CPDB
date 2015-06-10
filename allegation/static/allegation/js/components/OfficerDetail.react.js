var React = require('react');
var MapStore = require("../stores/MapStore");
var FilterActions = require("../actions/FilterActions");

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
        value: ['officers__id', this.props.officer.id]
    }]);

  },
  render: function(){
    var officer = this.props.officer;
    var complaintRate = 'below';
    var complaintRateLabel = 'Below the average complaints rate';
    if(officer.allegations_count > 20){
      complaintRate = 'above';
    }

    var rank_display = ranks[officer.rank];
    var gender_display = officer.gender == 'M' ? 'Male' : 'Female';
    return <div id='OfficerDetail' className={complaintRate}>
              <div className='row'>
                  <div className="col-md-9 h3">
                      <span className="star">{officer.star}</span>
                      {officer.officer_first} {officer.officer_last}
                  </div>
                  <div className='col-md-3 complaint-rate-label'>{complaintRateLabel}</div>
              </div>

              <div className='row'>
                  <div className="col-md-12 row information">
                      <table className="pull-right">
                          <tr>
                              <td><span className="title">Unit</span> {officer.unit}</td>
                              <td><span className="title">Rank</span> {rank_display}</td>
                              <td><span className="title">Star</span> {officer.star}</td>
                              <td><span className="title">Joined</span> {officer.appt_date}</td>
                              <td><span className="title">Gender</span> {gender_display}</td>
                              <td><span className="title">Race</span> {officer.race}</td>
                          </tr>
                      </table>
                  </div>
              </div>
          </div>
  },

});

module.exports = OfficerDetail
