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
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_MARKER_EVENT = 'change_marker';
var BEFORE_CHANGE_MARKER_EVENT = 'beofer_change_marker';

var _markers = null;
var _polygons = null;
var _state = {};


var MapStore = assign({}, EventEmitter.prototype, {
  getSession: function () {
    return {
      'map': _state
    };
  },
  setSession: function (opts) {
    if ('map' in opts) {
      _state = opts['map'];
    }
  },
  setState: function (state) {
    $.extend(_state, state);
  },
  getState: function () {
    return _state;
  },

  getMarkers: function () {
    return _markers;
  },

  getPolygons: function () {
    return _polygons;
  },

  removeChangeMarkerListener: function (callback) {
    this.removeListener(CHANGE_MARKER_EVENT, callback);
  },

  addChangeMarkerListener: function (callback) {
    this.on(CHANGE_MARKER_EVENT, callback);
  },

  emitChangeMarker: function () {
    this.emit(CHANGE_MARKER_EVENT);
  },

  removeBeforeChangeMarkerListener: function (callback) {
    this.removeListener(BEFORE_CHANGE_MARKER_EVENT, callback);
  },

  addBeforeChangeMarkerListener: function (callback) {
    this.on(BEFORE_CHANGE_MARKER_EVENT, callback);
  },

  emitBeforeChangeMarker: function () {
    this.emit(BEFORE_CHANGE_MARKER_EVENT);
  }
});


AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.MAP_CHANGE_MARKERS:
      _markers = action.markers;

      MapStore.emitBeforeChangeMarker();
      MapStore.emitChangeMarker();
      break;

    default:
      break;
  }
});


module.exports = MapStore;
