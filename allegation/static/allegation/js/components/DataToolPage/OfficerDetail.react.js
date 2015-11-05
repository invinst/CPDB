var classnames = require('classnames');

var AppConstants = require('constants/AppConstants');
var React = require('react');
var MapStore = require("stores/MapStore");
var FilterActions = require("actions/FilterActions");
var Timeline = require("components/DataToolPage/Officer/Timeline.react");
var Map = require("components/DataToolPage/Officer/Map.react");
var DonutChart = require("components/DataToolPage/Officer/DonutChart.react");
var OfficerMixin = require("components/DataToolPage/Officer/OfficerMixin.react");
var OfficerInformation = require('components/DataToolPage/OfficerDetail/OfficerInformation.react');

var OfficerDetail = React.createClass({
  mixins: [OfficerMixin],
  getInitialState: function () {
    return {}
  },

  componentDidMount: function () {
  },

  render: function () {
    var officer = this.props.officer;
    var hasMap = !!this.props.hasMap;
    var complaintRate = this.getAvgClass();

    var complaintRateLabel = 'Below the average complaint rate';
    if (officer.allegations_count > 20) {
      complaintRateLabel = 'Above the average complaint rate';
    }

    var mapStyle = {
      height: '240px'
    };

    var columnClass = classnames({
      'col-sm-4' : hasMap,
      'col-sm-6' : !hasMap
    });
    var mapDiv = "";
    var radius = 8;
    if(hasMap){
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
          <div className="col-sm-9 h3">
            <span className="star">{officer.star}</span>
            {officer.officer_first} {officer.officer_last}
          </div>
          <div className='col-sm-3 tright complaint-rate-label'>{complaintRateLabel}</div>
        </div>
        <OfficerInformation officer={officer} />
        <div className="row visualization-information">
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
