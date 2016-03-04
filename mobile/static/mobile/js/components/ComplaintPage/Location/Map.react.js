/*global L*/
var React = require('react');
var ReactDOM = require('react-dom');

var AppConstants = require('constants/AppConstants');

var ComplaintService = require('services/ComplaintService');
var Wrapper = require('components/Shared/Wrapper.react');
var Map;

require('mapbox.js');


Map = React.createClass({
  propTypes: {
    info: React.PropTypes.object
  },

  componentDidMount: function () {
    var complaintService = ComplaintService(this.props.info);
    var point = this.props.info.point;
    var defaultZoom,
      center,
      mapbox,
      map,
      circle;

    if (point) {
      defaultZoom = 16;
      center = [point.y, point.x];
      mapbox = L.mapbox;

      mapbox.accessToken = AppConstants.MAPBOX_TOKEN;

      map = mapbox.map(ReactDOM.findDOMNode(this), 'mapbox.streets').setView(center, defaultZoom);
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();

      if (complaintService.hasFullAddress) {
        L.marker(center).addTo(map);
      }
      else {
        circle = L.circle(center, 50, { color: 'red', fillColor: '#f03', fillOpacity: 0.5 }).addTo(map);
        circle.bindPopup('<b>Exact Address Not Available</b>').openPopup();
      }
    }
  },

  render: function () {
    return (
      <Wrapper wrapperClass='map' visible={ !!this.props.info.point } />
    );
  }
});

module.exports = Map;
