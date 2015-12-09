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
var _ = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
var FilterStore = require('./FilterStore');

var CHANGE_EVENT = 'change';
var SUMMARY_CHANGE = 'summary-change';
var firstCall = true;
var ajax = null;
var _state = {
  active_officers: []
};


var OfficerListStore = assign({}, EventEmitter.prototype, {
  getSession: function () {
    return {'active_officers': _.clone(_state['active_officers'])};
  },

  setSession: function (data) {
    this.set('active_officers', data.active_officers || []);
  },

  getActiveOfficers: function() {
    return _state.active_officers;
  },

  getQueryString: function () {
    var queryString = FilterStore.getQueryString();
    for (var i = 0; i < _state['active_officers'].length; i++) {
      queryString += "officer=" + _state['active_officers'][i] + "&"
    }
    return queryString;
  },

  update: function (query) {
    if (ajax) {
      ajax.abort();
    }
    var queryString = query || FilterStore.getQueryString();

    _state.filtered = queryString;

    ajax = $.getJSON('/api/allegations/officers/?' + queryString, function (data) {
      _state.officers = _.sortBy(_.merge(data.officers, data.allegations_count), function (officer) {
        return -officer.allegations_count;
      });
      _state.overview = data.overview || [];
      OfficerListStore.emitChange();
    });
  },

  set: function (key, value) {
    _state[key] = value;
    this.emitChange();
  },

  init: function () {
    this.update();
    return _.clone(_state);
  },

  getAll: function () {
    return _.clone(_state);
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

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  addSummaryListener: function (callback) {
    this.on(SUMMARY_CHANGE, callback);
  }

});


// Register callback to handle all updates
OfficerListStore.dispatchEvent = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.MAP_REPLACE_FILTERS:
    case AppConstants.MAP_CHANGE_FILTER:
    case AppConstants.MAP_ADD_FILTER:
    case AppConstants.ADD_TAG:
    case AppConstants.REMOVE_TAG:
    case AppConstants.TOGGLE_TAGS:
      if (!firstCall) {
        OfficerListStore.set('active_officers', []);
      }
      firstCall = false;
      OfficerListStore.update();
      break;

    case AppConstants.OFFICER_VIEW_MORE:
      OfficerListStore.set('show_more', !_state['show_more']);
      break;

    case AppConstants.SET_OFFICER_LIST_FILTER:
      _state.complaints_count_start = action.start;
      _state.complaints_count_end = action.end;
      OfficerListStore.update();
      break;

    case AppConstants.SET_ACTIVE_OFFICER:
      var index = _state.active_officers.indexOf(action.officer.id);
      if (index == -1) {
        _state.active_officers.push(action.officer.id);
      }
      else {
        _state.active_officers.splice(index, 1);
      }
      OfficerListStore.emitChange();
      break;

    case AppConstants.RECEIVED_SESSION_DATA:
      var data = action.data.data;
      _state['active_officers'] = data['query']['active_officers'] || [];
      OfficerListStore.update();
      OfficerListStore.emitChange();
      break;

    default:
      break;
  }
  if (firstCall){
    OfficerListStore.update();
    firstCall = false;
  }
});

module.exports = OfficerListStore;
