var React = require('react');
require('mapbox.js');
require('leaflet.heat');
L.mapbox.accessToken = '***REMOVED***';

var Map = React.createClass({
  componentDidMount: function () {
    var defaultZoom =  11;
    var center = [41.85677, -87.6024055];
    var map = L.mapbox.map(this.getDOMNode(), 'mapbox.streets').setView(center, defaultZoom);
    //map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
  },

  render: function () {
    return <div className='map'></div>;
  }
});

module.exports = Map;
