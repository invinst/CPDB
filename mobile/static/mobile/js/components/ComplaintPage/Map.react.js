var React = require('react');
require('mapbox.js');

var AppConstants = require('constants/AppConstants');

var ComplaintService = require('services/ComplaintService');


var Map = React.createClass({
  componentDidMount: function () {
    var complaintService = ComplaintService(this.props.info);
    var point = this.props.info.point;

    if (point){
      var defaultZoom = 16;
      var center = [point.y, point.x];
      var mapbox = L.mapbox;

      mapbox.accessToken = AppConstants.MAPBOX_TOKEN;

      var map = mapbox.map(this.getDOMNode(), 'mapbox.streets').setView(center, defaultZoom);
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();

      if (complaintService.hasFullAddress) {
        L.marker(center).addTo(map);
      }
      else {
        var circle = L.circle(center, 50, { color: 'red',  fillColor: '#f03', fillOpacity: 0.5 }).addTo(map);
        circle.bindPopup('<b>Exact Address Not Available</b>').openPopup();
      }
    }
  },

  render: function () {
    var point = this.props.info.point;

    if (!point){
      return (<div></div>);
    }
    return <div className='map'></div>;
  }
});

module.exports = Map;
