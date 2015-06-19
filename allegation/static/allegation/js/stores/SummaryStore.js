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
var FilterStore = require('./FilterStore');
var CHANGE_EVENT = 'change';
var SUMMARY_CHANGE = 'summary-change';
var _state = {
  'rows': [],
  'current': false
};
var _complaints = {};


/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _complaints[id] = assign({}, _complaints[id], updates);
}


function create(id, complaint) {
  _complaints[id] = {
    'items': filter,
    'value': "Select a " + id
  };
}


var SummaryStore = assign({}, EventEmitter.prototype, {
  update: function () {
    var query_string = FilterStore.getQueryString();
    $.getJSON('/api/allegations/summary/?' + query_string, function (data) {
      _state['rows'] = data.summary;
      SummaryStore.emitChange();
    })
  },
  set: function (key, value) {
    _state[key] = value;
  },
  init: function () {
    _state = {
      'rows': [],
      'current': false
    };
    this.update();
    return _state;
  },
  getAll: function (type) {
    return _state;
  },
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },
  emitSummaryChange: function () {
    this.emit(SUMMARY_CHANGE);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  addSummaryListener: function (callback) {
    this.on(SUMMARY_CHANGE, callback);
  }

});

// Register callback to handle all updates
AppDispatcher.register(function (action) {

  switch (action.actionType) {
    case MapConstants.MAP_REPLACE_FILTERS:
    case MapConstants.MAP_CHANGE_FILTER:
    case MapConstants.MAP_ADD_FILTER:
      SummaryStore.update();
      break;

    case MapConstants.SET_SUMMARY:
      SummaryStore.set('current', action.type);
      SummaryStore.emitSummaryChange();
      break;

    default:
      break;
  }
});

module.exports = SummaryStore;
