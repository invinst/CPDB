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
var AppConstants = require('../constants/AppConstants');

var assign = require('object-assign');
var OfficerStore = require('./OfficerStore');
var OutcomeFilterStore = require('./ComplaintList/OutcomeFilterStore');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var _state = {
  'complaints': []
};


var ComplaintListStore = assign({}, EventEmitter.prototype, {
  outcomeFilterQuery: function(activeFilter) {
    if (activeFilter == 'all') {
      return '';
    }

    if (activeFilter == 'disciplined') {
      return ['final_outcome_class', activeFilter].join('=');
    }

    if (activeFilter == 'other') {
      return AppConstants.FILTER_CODES[activeFilter].map(function (x) {
        return 'final_finding=' + x
      }).join('&');
    }

    return ['final_finding', AppConstants.FILTER_CODES[activeFilter]].join('=');
  },

  update: function () {
    var queryString = OfficerStore.getQueryString();
    var activeFilter = OutcomeFilterStore.getState().activeFilter;
    var outcomeFilterQuery = this.outcomeFilterQuery(activeFilter);

    if (!queryString) {
      this.changeComplaintList([]);
      return;
    }

    queryString = queryString + outcomeFilterQuery;
    var that = this;

    $.getJSON('/api/allegations/?' + queryString, function (data) {
      that.changeComplaintList(data.allegations);
    })
  },

  changeComplaintList: function(complaints) {
    _state['complaints'] = complaints;
    this.emitChange();
  },

  set: function (key, value) {
    _state[key] = value;
    this.emitChange();
  },

  init: function (initial) {
    if (!initial) {
      this.update();
    }
    else {
      _state = initial;
    }
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
      ComplaintListStore.update();
      break;

    case MapConstants.MAP_CHANGE_FILTER:
      ComplaintListStore.update();
      break;

    case MapConstants.MAP_ADD_FILTER:
      ComplaintListStore.update();
      break;

    case MapConstants.SET_ACTIVE_OFFICER:
      ComplaintListStore.update();
      break;

    case AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER:
      ComplaintListStore.update();
      break;

    default:
      break;
  }
});

module.exports = ComplaintListStore;
