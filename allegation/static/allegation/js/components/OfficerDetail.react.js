var React = require('react');
var MapStore = require("../stores/MapStore");
var FilterStore = require("../stores/FilterStore");


var OfficerDetail = React.createClass({
  getInitialState: function() {
     return {}
  },
  componentDidMount: function() {
    FilterStore.update('officer_id',{'value':[this.props.officer.id]})
    MapStore.init('officer-complaint-map',{'maxZoom': 14,'minZoom': 8,'defaultZoom': 8});

    var data = [
        [1, 5],
        [1, 14],
        [0, 22]
    ];

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
  },
  render: function(){
    var officer = this.props.officer;
    var complaintRate = 'below';
    var complaintRateLabel = 'Below the average complaints rate';
    if(officer.allegations_count > 20){
      complaintRate = 'above';
    }
    return <div id='OfficerDetail'>
              <div className='row'>
                <div className='col-sm-1'>
                  <div className={complaintRate}>{officer.star}</div>
                </div>
                <h3 className='col-sm-9'>{officer.officer_first} {officer.officer_last}</h3>
                <div className='col-sm-2'>{complaintRateLabel}</div>
              </div>

              <div className='row'>
                <span>{officer.unit}</span>
                <span>{officer.rank_display}</span>
                <span>{officer.star}</span>
                <span>{officer.appt_date}</span>
                <span>{officer.gender_display}</span>
                <span>{officer.race}</span>
              </div>

             <div className='row'>
                <div className='col-sm-3'>
                  <div id='officer-complaint-map'>
                  </div>
                </div>
                <div className='col-sm-offset-1 col-sm-4'>
                  Timeline
                </div>
                <div className='col-sm-offset-1 col-sm-3'>
                  <div id='dis-compl'>
                    <div className='chart'></div>
                  </div>
                </div>
              </div>
          </div>
  },

});

module.exports = OfficerDetail
