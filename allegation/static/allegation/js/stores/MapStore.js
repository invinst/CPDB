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


var CHANGE_EVENT = 'change';
var CHANGE_MARKER_EVENT = 'change_marker';
var BEFORE_CHANGE_MARKER_EVENT = 'beofer_change_marker';

var _queryString = null;
var _ajax_req = null;
var _markers = null;
var _state = {};


var MapStore = assign({}, EventEmitter.prototype, {
  getSession: function () {
    return {
      'map': _state
    }
  },
  setSession: function (opts) {
    if ('map' in opts) {
      _state = opts['map'];
    }
  },
  setState: function(state) {
    $.extend(_state, state);
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

  getPolygons: function () {
    return _polygons;
  },

  update: function (query) {
    var queryString = query || FilterStore.getQueryString(['areas__id']);
    this.changeQuery(queryString);
  },

  changeQuery: function (queryString) {
    var store = this;
    if (queryString == _queryString) {
      return;
    }
    _queryString = queryString;
    if (_ajax_req) {
      _ajax_req.abort();
    }

    this.emitBeforeChangeMarker();

    _ajax_req = $.getJSON("/api/allegations/cluster/?" + queryString, function (data) {
      _markers = data;
      store.emitChangeMarker();
    });
  },

  addChangeMarkerListener: function (callback) {
    this.on(CHANGE_MARKER_EVENT, callback);
  },

  emitChangeMarker: function () {
    this.emit(CHANGE_MARKER_EVENT);
  },

  addBeforeChangeMarkerListener: function (callback) {
    this.on(BEFORE_CHANGE_MARKER_EVENT, callback);
  },

  emitBeforeChangeMarker: function () {
    this.emit(BEFORE_CHANGE_MARKER_EVENT);
  }
});

module.exports = MapStore;
