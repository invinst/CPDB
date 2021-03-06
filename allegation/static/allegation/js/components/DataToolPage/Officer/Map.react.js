var React = require('react');
var PropTypes = React.PropTypes;
var ReactDOM = require('react-dom');

var _map = null;
var AppConstants = require('constants/AppConstants');
var Map;

require('mapbox.js');
require('leaflet.markercluster');


Map = React.createClass({
  propTypes: {
    options: PropTypes.object,
    officer: PropTypes.object,
    style: PropTypes.object
  },

  getInitialState: function () {
    return {};
  },
  componentDidMount: function () {
    this.initMap(this.props.options);
    this.drawHeatMap('officer=' + this.props.officer.id);
  },
  drawHeatMap: function (queryString) {
    $.getJSON('/api/officer-allegations/gis/?' + queryString, function (markers) {

      var iconCreateFunction = function (cluster) {
        var childCount = cluster.getChildCount();

        var className = ' marker-cluster-';
        var size = 40;
        if (childCount < 10) {
          className += 'small';
          size = 20;
        } else if (childCount < 30) {
          className += 'medium';
        } else {
          className += 'large';
          size = 60;
        }

        return new L.DivIcon({
          html: '<div style="width:' + (size - 10) + 'px;height:' + (size - 10) + 'px;border-radius:' +
            (size/2) + 'px;"><span></span></div>',
          className: 'marker-cluster' + className,
          iconSize: new L.Point(size, size)
        });
      };

      var _markers = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        iconCreateFunction: iconCreateFunction,
        singleMarkerMode: true
      });
      var _controls = {};

      var markerLength = markers.features.length;
      var start = 0;
      var count = 3000;

      var addMarkers = function () {
        var features = markers.features.slice(start, start + count);
        var featuresMarkers;

        start += count;
        featuresMarkers = L.geoJson({features: features}, {
          pointToLayer: L.mapbox.marker.style,
          style: function (feature) {
            return feature.properties;
          }

        });
        featuresMarkers.on('click', function (e) {
          var target = $('#allegation-' + e.layer.feature.properties.id);
          target.click();
          $('html, body').animate({
            'scrollTop': target.offset().top
          }, 2000);

        });
        _markers.addLayer(featuresMarkers);
        _map.fitBounds(_markers.getBounds());

        if (start > markerLength) {
          return;
        }

        setTimeout(function () {
          addMarkers();
        }, 0.5);
      };

      _controls['markers'] = _markers;
      _map.addLayer(_markers);

      addMarkers();
    });
  },
  initMap: function (opts) {
    var element = ReactDOM.findDOMNode(this);
    var defaultZoom,
      southWest,
      northEast,
      maxBounds;

    opts = opts || {'maxZoom': 17, 'minZoom': 10, 'scrollWheelZoom': false};
    defaultZoom = 'defaultZoom' in opts ? opts['defaultZoom'] : 12;

    southWest = L.latLng(41.143501411390766, -88.53057861328125);
    northEast = L.latLng(42.474122772511485, -85.39947509765625);
    maxBounds = L.LatLngBounds(southWest, northEast);

    _map = L.mapbox.map(element, AppConstants.MAP_TYPE, opts)
      .setView([41.870839118528714, -87.6272964477539], defaultZoom);
    _map.on('click', function (event) {
    }).setMaxBounds(maxBounds);
  },
  render: function () {
    return <div style={ this.props.style }></div>;
  }
});

module.exports = Map;
