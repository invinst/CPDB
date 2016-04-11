var AppConstants, MapFacade;

require('mapbox.js');

AppConstants = require('constants/AppConstants');


MapFacade = {
  map: null,
  center: null,

  initialize: function (domNode, point) {
    var defaultZoom = 16;
    var mapbox = L.mapbox;

    mapbox.accessToken = AppConstants.MAPBOX_TOKEN;
    this.center = [point.y, point.x];
    this.map = mapbox.map(domNode, 'mapbox.streets').setView(this.center, defaultZoom);

    this.map.doubleClickZoom.disable();
    this.map.scrollWheelZoom.disable();
  },

  addAccidentPlaceMarker: function () {
    if (this.map) {
      L.marker(this.center).addTo(this.map);
    }
  },

  addNoAddressPopup: function () {
    var circle;

    if (this.map) {
      circle = L.circle(this.center, 50, { color: 'red', fillColor: '#f03', fillOpacity: 0.5 }).addTo(this.map);
      circle.bindPopup('<b>Exact Address Not Available</b>').openPopup();
    }
  }
};

module.exports = MapFacade;
