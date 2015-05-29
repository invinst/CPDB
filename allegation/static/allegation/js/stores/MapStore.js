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
var _markers = {}
var _map = null;
var _polygons = null;
var _geo_json_layer = null;
var _heat = null;
var _areas = {}
var _controls = {};
var _layers = {}
/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _todos[id] = assign({}, _todos[id], updates);
}
function create(){
    L.mapbox.accessToken = MBX;
    _map = L.mapbox.map('map', MAP_TYPE).setView([41.8369, -87.68470], 9);
    createAreas();
}
function createAreas(){
    if(_geo_json_layer){
        console.log('unsetting')
        _map.removeLayer(_geo_json_layer);
    }

    $.get("/api/areas/",function(data){

        _geo_json_layer = L.geoJson(data, {
          pointToLayer: L.mapbox.marker.style,
          style: function(feature) { return feature.properties; },
          onEachFeature: function(feature, layer){
            var msg = [];
            var area_type = feature.properties.type;
            msg.push(area_type + " name: "+feature.properties.name);
            layer.bindPopup(msg.join(''), {maxWidth: 200});
            layer.on('mouseover',function(){
              layer.setStyle(highlightStyle);
            });
            layer.on('mouseout',function(){
              layer.setStyle(feature.properties);
            });

            if(!(area_type in _layers)){
              _layers[area_type] = L.layerGroup();
              _controls[area_type] = _layers[area_type];
            }
            _layers[area_type].addLayer(layer);
          }
        })
        L.control.layers(_controls).addTo(_map);

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
    if(_markers){
        console.log('unsetting')
        _map.removeLayer(_markers);
    }
    if(_heat){
        _map.removeLayer(_heat);
    }
    if(_markers){
        _map.removeLayer(_markers)
    }

    _markers = L.markerClusterGroup();
    _map.addLayer(_markers);

    markers = L.geoJson(markers, {
          pointToLayer: L.mapbox.marker.style,
          style: function(feature) { return feature.properties; },

        })
    _markers.addLayer(markers);
  },
  getMap: function(){
    return _map;
  },
  getPolygons: function(){
    return _polygons;
  },
  init: function(){
      return create();
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
