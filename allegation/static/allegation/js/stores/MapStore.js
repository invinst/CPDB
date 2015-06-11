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

var assign = require('object-assign');
var MBX = 'pk.eyJ1Ijoic3RlZmFuZ2VvcmciLCJhIjoiVnBNOEp4byJ9.7i2N7gTV-t_QtAA-kAAlFA';
var MAP_TYPE = 'mapbox.streets';
var highlightStyle = {
    color: '#2262CC',
    weight: 3,
    opacity: 0.6,
    fillOpacity: 0.65,
    fillColor: '#2262CC'
};
var CHANGE_EVENT = 'change';
var _markers = {};
var _map = null;
var _polygons = null;
var _geo_json_layer = null;
var _heat = null;
var _areas = {};
var _controls = {};
var _layers = {};
var _baseLayers = {};
var _ajax_req = null;
var current_markers = null;


function create(dom_id, opts){
    dom_id = dom_id ? dom_id : 'map';
    opts = opts ? opts : {'maxZoom': 17,'minZoom': 10}
    defaultZoom = 'defaultZoom' in opts ? opts['defaultZoom'] : 12;

    L.mapbox.accessToken = MBX;
    var southWest = L.latLng(41.143501411390766,-88.53057861328125)
    var northEast = L.latLng(42.474122772511485,-85.39947509765625)
    var maxBounds = L.LatLngBounds(southWest,northEast)
    _map = L.mapbox.map(dom_id, MAP_TYPE, opts).setView([41.85677, -87.6024055], defaultZoom);
    _map.on('click',function(event){

    }).setMaxBounds(maxBounds);
    createAreas();
    MapStore.update();
}
function createAreas(){
    if(_geo_json_layer){
        _map.removeLayer(_geo_json_layer);
    }
    var normalStyle = {"fillColor": "#eeffee", "fillOpacity": 0.5,'weight': 2};
    $.get("/api/areas/",function(data){
        var first_layer_added = false;
        _geo_json_layer = L.geoJson(data, {
          pointToLayer: L.mapbox.marker.style,
          style: function(feature) {
           return normalStyle
          },
          onEachFeature: function(feature, layer){

            layer.selected = false;
            var area_type = feature.properties.type;
            layer.on('mouseover',function(){
              layer.setStyle(highlightStyle);
            });

            layer.on('mouseout',function(){
              if(!layer.selected){
                layer.setStyle(normalStyle);
              }
            });

            var tagValue = {
              text: area_type + ": " + feature.properties.name,
              value: ['areas__id',  feature.properties.id],
              layer: layer
            };

            layer.toggleStyle = function(){
              if(!layer.selected){
                layer.selected = true;
                layer.setStyle(highlightStyle);
              }
              else{
                layer.selected = false;
                layer.setStyle(normalStyle);
              }
            };

            layer.on('click', function(){
              if(!layer.selected){
                $('#cpdb-search').tagsinput("add", tagValue);
              }
              else{
                $('#cpdb-search').tagsinput("remove", tagValue);
              }
            });

            if(!(area_type in _layers)){
              _layers[area_type] = L.layerGroup();
              _baseLayers[area_type] = _layers[area_type];
              if(!first_layer_added && area_type == 'police-districts'){
                first_layer_added = true;
                _map.addLayer(_layers[area_type]);
              }
            }
            _layers[area_type].addLayer(layer);
          }
        });
        L.control.layers(_baseLayers,_controls).addTo(_map);

    },'json').fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
    })
}


var MapStore = assign({}, EventEmitter.prototype, {
  getToken: function(){
    return MBX;
  },
  getMarkers: function(){
    return _markers;
  },
  setMarkers: function(markers){
    current_markers = markers;
    if(_markers){
        _map.removeLayer(_markers);
    }
    if(_heat){
        _map.removeLayer(_heat);
    }
    if(_markers){
        _map.removeLayer(_markers)
    }

    _heat = L.heatLayer([], {radius: 8});
    _markers = L.markerClusterGroup();
    _controls['markers'] = _markers;
    _controls['heat-map'] = _heat;
    _map.addLayer(_markers);

    var marker_length = markers.features.length;
    var start = 0;
    var count = 1500;
    var max_markers_to_add = 8000;

    function addMarkers(){
      if (current_markers != markers) {
        return;
      }
      var features = markers.features.slice(start, start + count)
      start += count;
      var featuresMarkers = L.geoJson({features: features}, {
            pointToLayer: L.mapbox.marker.style,
            style: function(feature) { return feature.properties; },
            onEachFeature: function(feature, layer){
              if(feature.geometry.coordinates && feature.geometry.coordinates[0]){
                _heat.addLatLng([feature.geometry.coordinates[1],feature.geometry.coordinates[0]])
              }
            }
          });
      _markers.addLayer(featuresMarkers);

      if(start > marker_length){
        return;
      }
      if(count < max_markers_to_add){
        count += 1000;
      }

      setTimeout(function(){
        addMarkers();
      }, 0.5);
    }
    addMarkers();

  },
  getMap: function(){
    return _map;
  },
  getPolygons: function(){
    return _polygons;
  },
  update: function(){
    if(!this.getMap()){
        return;
    }
    var store = this;
    var query_string = FilterStore.getQueryString();
    if(_ajax_req){
      _ajax_req.abort();
    }
    _ajax_req = $.getJSON("/api/allegations/gis/?" + query_string, function(data){
      store.setMarkers(data);
    });
  },
  init: function(dom_id, opts){
      return create(dom_id, opts);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType){
    case MapConstants.INIT:
      create(action);
      break;

    case MapConstants.MAP_CHANGE_FILTER:
      if(action.key == 'area_types'){
        setArea(action.value.value)
      }
      break;

    default:
      break;
  }
});

module.exports = MapStore;
