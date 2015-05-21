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

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MapConstants = require('../constants/MapConstants');
var assign = require('object-assign');
var HOST = 'http://localhost:8000';
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
    setArea('beat');
}
function setArea(area_type){
    if(_geo_json_layer){
        console.log('unsetting')
        _map.removeLayer(_geo_json_layer);
    }
    console.log(HOST);
    $.get(HOST + "/api/areas/?type=" + area_type,{},function(data){

        //FilterAction.addFilter('area',data);
        //console.log(data);
        //console.log(data);
        _geo_json_layer = L.geoJson(data, {
          pointToLayer: L.mapbox.marker.style,
          style: function(feature) { return feature.properties; },
          onEachFeature: function(feature, layer){
            var date = new Date(feature.properties.startTime);
            var triggerId = feature.properties.activityId;
            var msg = [];
            msg.push(area_type + " name: "+feature.properties.name);

            layer.bindPopup(msg.join(''), {maxWidth: 200});
          }
        }).addTo(_map);


    },'json').fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
    })
}


var MapStore = assign({}, EventEmitter.prototype, {

  getMarkers: function(){
    return _markers;
  },
  setMarkers: function(markers){
    if(_markers){
        console.log('unsetting')
        _map.removeLayer(_markers);
    }
    _markers = L.geoJson(markers, {
          pointToLayer: L.mapbox.marker.style,
          style: function(feature) { return feature.properties; },
          onEachFeature: function(feature, layer){
            var date = new Date(feature.properties.startTime);
            var triggerId = feature.properties.activityId;
            var msg = [];
            msg.push("Crid: "+feature.properties.name);

            layer.bindPopup(msg.join(''), {maxWidth: 200});
          }
        }).addTo(_map);
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
        console.log(action);
        setArea(action.value.value)
      }
      break;
    default:
      // no op
  }
});

module.exports = MapStore;
