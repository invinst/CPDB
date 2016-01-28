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

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');

var CHANGE_EVENT = 'change';
var SUMMARY_CHANGE = 'summary-change';
var ajax = false;
var _state = {
  'rows': [],
  'current': false
};
var _complaints = {};
var _currentActive = false;


function update(id, updates) {
  _complaints[id] = assign({}, _complaints[id], updates);
}


function create(id, complaint) {
  _complaints[id] = {
    'items': filter,
    'value': 'Select a ' + id
  };
}


var SummaryStore = assign({}, EventEmitter.prototype, {
  update: function (query) {
    var queryString = query || AllegationFilterTagsQueryBuilder.buildQuery();
    if (ajax) {
      ajax.abort();
    }
    ajax = $.getJSON('/api/officer-allegations/summary/?' + queryString, function (data) {
      _state['rows'] = data.summary;
      SummaryStore.emitChange();
    });
  },
  set: function (key, value) {
    _state[key] = value;
  },
  setCurrentActive: function(val){
    _currentActive = val;
    SummaryStore.emitChange();
  },
  getCurrentActive: function(){
    return _currentActive;
  },
  init: function (query) {
    _state = {
      'rows': [],
      'current': false
    };
    this.update(query);
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
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  removeSummaryListener: function (callback) {
    this.removeListener(SUMMARY_CHANGE, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {

  switch (action.actionType) {
    case AppConstants.MAP_REPLACE_FILTERS:
    case AppConstants.MAP_CHANGE_FILTER:
    case AppConstants.MAP_ADD_FILTER:
    case AppConstants.ADD_TAG:
    case AppConstants.REMOVE_TAG:
    case AppConstants.SAVE_TAGS:
    case AppConstants.RECEIVED_SESSION_DATA:
    case AppConstants.SUNBURST_SELECT_ARC:
      SummaryStore.update();
      break;

    case AppConstants.SET_SUMMARY:
      SummaryStore.set('current', action.type);
      SummaryStore.emitSummaryChange();
      break;

    default:
      break;
  }
});

module.exports = SummaryStore;
