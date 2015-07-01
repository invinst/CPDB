var React = require('react');
var _map = null;


var Map = React.createClass({
  getInitialState: function () {
    return {};
  },
  initMap: function (opts) {
    var element = this.getDOMNode();
    var opts = opts || {'maxZoom': 17, 'minZoom': 10, 'scrollWheelZoom': false};
    var defaultZoom = 'defaultZoom' in opts ? opts['defaultZoom'] : 12;

    var southWest = L.latLng(41.143501411390766, -88.53057861328125);
    var northEast = L.latLng(42.474122772511485, -85.39947509765625);
    var maxBounds = L.LatLngBounds(southWest, northEast);

    _map = L.mapbox.map(element, MAP_TYPE, opts).setView([41.870839118528714, -87.6272964477539], defaultZoom);
    _map.on('click', function (event) {
      console.log(event);
    }).setMaxBounds(maxBounds);
  },
  drawHeatMap: function (query_string) {
    $.getJSON("/api/allegations/gis/?" + query_string, function (markers) {
      var _heat = L.heatLayer([], {radius: 8, blur: 16, maxZoom: 10});
      var _markers = L.markerClusterGroup();
      var _controls = {};
      _controls['markers'] = _markers;
      _controls['heat-map'] = _heat;
      _map.addLayer(_heat);

      var marker_length = markers.features.length;
      var start = 0;
      var count = 3000;

      function addMarkers() {
        var features = markers.features.slice(start, start + count);
        start += count;
        var featuresMarkers = L.geoJson({features: features}, {
          pointToLayer: L.mapbox.marker.style,
          style: function (feature) {
            return feature.properties;
          },
          onEachFeature: function (feature, layer) {
            if (feature.geometry.coordinates && feature.geometry.coordinates[0]) {
              _heat.addLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
            }
          }
        });
        _markers.addLayer(featuresMarkers);

        if (start > marker_length) {
          return;
        }

        setTimeout(function () {
          addMarkers();
        }, 0.5);
      }

      addMarkers();
    });
  },
  componentDidMount: function () {
    this.initMap(this.props.options);
    this.drawHeatMap('officer=' + this.props.officer.id);
  },
  render: function () {
    return <div style={this.props.style}></div>
  }
});

module.exports = Map;
