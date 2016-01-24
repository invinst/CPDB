require('mapbox.js');
require('leaflet.heat');

var React = require('react');

var AppConstants = require('constants/AppConstants');


L.mapbox.accessToken = AppConstants.MAP_TOKEN;

var Map = React.createClass({
  getDefaultProps: function () {
    return {
      'center': [41.85677, -87.6024055],
      'defaultZoom': 11,
      'maxZoom': 17,
      'minZoom': 10,
      'scrollWheelZoom': false
    };
  }
});

module.exports = Map;
