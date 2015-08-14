/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * MapStore
 */
var LeafletClusters = require("leaflet.markercluster");
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MapConstants = require('../constants/MapConstants');
var FilterStore = require('./FilterStore');
var FilterActions = require('../actions/FilterActions');
var assign = require('object-assign');

var highlightStyle = {
  color: '#2262CC',
  weight: 3,
  opacity: 0.6,
  fillOpacity: 0.65,
  fillColor: '#2262CC'
};
var CHANGE_EVENT = 'change';
var _map = null;
var _polygons = null;
var _geo_json_layer = null;
var _heat = null;
var _areas = {};
var _controls = {};
var _layers = {};
var _baseLayers = {};
var _controlDiv = null;
var _ajax_req = null;
var _queryString = null;
var _normalStyle = {"fillColor": "#eeffee", "fillOpacity": 0.0, 'weight': 2};
var _state = {
  'maxZoom': 17,
  'minZoom': 10,
  'scrollWheelZoom': false
};
var _types = ['police-districts', 'wards', 'police-beats', 'neighborhoods'];

function create(dom_id, opts) {
  dom_id = dom_id ? dom_id : 'map';
  opts = opts ? opts : _state;
  var defaultZoom = 'defaultZoom' in opts ? opts['defaultZoom'] : 11;
  var center = 'center' in opts ? opts['center'] : [41.85677, -87.6024055];

  var southWest = L.latLng(41.143501411390766, -88.53057861328125);
  var northEast = L.latLng(42.474122772511485, -85.39947509765625);
  var maxBounds = L.LatLngBounds(southWest, northEast);
  _map = L.mapbox.map(dom_id, MAP_TYPE, opts).setView(center, defaultZoom);
  _map.on('click', function (event) {

  }).setMaxBounds(maxBounds);
    _map.on('move',function () {
      FilterActions.saveSession();
    });
  createAreas();
  MapStore.update();
}
function getAreaBoundaries(type) {
  filters = FilterStore.getAll();
  $.get("/api/areas/?type=" + type, function (data) {
    var first_layer_added = false;
    _geo_json_layer = L.geoJson(data, {
      pointToLayer: L.mapbox.marker.style,
      style: function (feature) {
        return _normalStyle
      },
      onEachFeature: function (feature, layer) {
        layer.selected = false;
        if ('areas__id' in filters) {
          if (filters['areas__id']['value'].indexOf(feature.properties.id) > -1) {
            layer.selected = true;
            layer.setStyle(highlightStyle);
          }
        }

        var area_type = feature.properties.type;
        layer.on('mouseover', function () {
          $(".leaflet-control-command-interior").show().text(feature.properties.name);
          layer.setStyle(highlightStyle);
        });

        layer.on('mouseout', function () {
          $(".leaflet-control-command-interior").hide().text("");
          if (!layer.selected) {
            layer.setStyle(_normalStyle);
          }
        });

        var tagValue = {
          text: area_type + ": " + feature.properties.name,
          value: ['areas__id', feature.properties.id],
          layer: layer
        };

        layer.toggleStyle = function () {
          if (!layer.selected) {
            layer.selected = true;
            layer.setStyle(highlightStyle);
          }
          else {
            layer.selected = false;
            layer.setStyle(_normalStyle);
          }
        };

        layer.on('click', function () {
          if (!layer.selected) {
            $('#cpdb-search').tagsinput("add", tagValue);
          }
          else {
            $('#cpdb-search').tagsinput("remove", tagValue);
          }
        });
        if (!(area_type in _layers)) {
          _layers[area_type] = L.layerGroup();
          _baseLayers[prettyLabels(area_type).capitalize()] = _layers[area_type];
          if (!first_layer_added && area_type == 'police-districts') {
            first_layer_added = true;
            _map.addLayer(_baseLayers[prettyLabels(area_type).capitalize()]);
          }

        }
        _layers[area_type].addLayer(layer);


      }
    });
    var nextTypeIndex = _types.indexOf(type) + 1;
    if (_types[nextTypeIndex]) {
      getAreaBoundaries(_types[nextTypeIndex])
    }
    else {
      L.control.layers(_baseLayers,{}, {collapsed: false}).addTo(_map);
    }
  }, 'json').fail(function(jqxhr, textStatus, error) {
    var err = textStatus + ", " + error;
    console.log("Request Failed: " + err);
  })
}

function createAreas() {
  if (_geo_json_layer) {
    _map.removeLayer(_geo_json_layer);
  }

  getAreaBoundaries(_types[0]);

  L.Control.Command = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'leaflet-control-command');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
        .addListener(controlDiv, 'click', function () { MapShowCommand(); });

        var controlUI = L.DomUtil.create('div', 'leaflet-control-command-interior', controlDiv);
        controlUI.title = '';
        return controlDiv;
    }
  });
  L.control.command = function (options) {
      return new L.Control.Command(options);
  };
  var areaHover = new L.Control.Command();
  _map.addControl(areaHover);
}


var MapStore = assign({}, EventEmitter.prototype, {
  getSession: function () {
    var center = _map.getCenter();
    center = [center['lat'],center['lng']];
    return {
      'map': {
        'bounds': _map.getBounds(),
        'defaultZoom': _map.getZoom(),
        'center': center,
        'maxZoom': 17,
        'minZoom': 10,
        'scrollWheelZoom': false
      }
    }
  },
  setSession: function (opts) {
    if ('map' in opts) {
      _state = opts['map'];
    }
  },
  getState: function(){
    return _state;
  },
  getToken: function () {
    return MBX;
  },
  getMarkers: function () {
    return _markers;
  },

  mapIntensity: function(markersLength) {
    var intensity = 1;
    if (markersLength < 15000 ) {
       intensity = markersLength / 15000;
    }
    return intensity;
  },

  setMarkers: function (markers) {
    var latLngs = [];
    var features = markers.features;
    var heatOpts = { radius: 10, max: this.mapIntensity(features.length) };

    if (_heat) {
      _map.removeLayer(_heat);
    }

    var featuresMarkers = L.geoJson({features: features}, {
      pointToLayer: L.mapbox.marker.style,
      style: function (feature) {
        return feature.properties;
      },
      onEachFeature: function (feature, layer) {
        if (feature.geometry.coordinates && feature.geometry.coordinates[0]) {
          latLngs.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
        }
      }
    });
    _heat = L.heatLayer(latLngs, heatOpts);
    _map.addLayer(_heat);

  },

  getMap: function () {
    return _map;
  },
  getPolygons: function () {
    return _polygons;
  },
  update: function () {
    if (!this.getMap()) {
      return;
    }
    var store = this;
    var queryString = FilterStore.getQueryString();
    if (queryString == _queryString) {
      return;
    }
    _queryString = queryString;
    if (_ajax_req) {
      _ajax_req.abort();
    }

    _ajax_req = $.getJSON("/api/allegations/cluster/?" + queryString, function (data) {
      store.setMarkers(data);
    });
  },
  init: function (dom_id, opts) {
    opts = opts || _state;
    return create(dom_id, opts);
  }
});


// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case MapConstants.INIT:
      create(action);
      break;

    case MapConstants.MAP_CHANGE_FILTER:
      if (action.key == 'area_types') {
        setArea(action.value.value)
      }
      break;

    default:
      break;
  }
});

module.exports = MapStore;
