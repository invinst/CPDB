var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MapConstants = require('../constants/MapConstants');
var AppConstants = require('../constants/AppConstants');
var ajax = null;
var assign = require('object-assign');
var OfficerStore = require('./OfficerStore');
var _ = require('lodash');

var OutcomeAnalysisAPI = require('../utils/OutcomeAnalysisAPI');
var CHANGE_EVENT = 'change';

var _state = {
  'complaints': [],
  'activeFilter': 'all',
  'analytics': []
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
    var activeFilter = _state['activeFilter'];
    var outcomeFilterQuery = this.outcomeFilterQuery(activeFilter);

    if (!queryString) {
      this.changeComplaintList([]);
      return;
    }
    if (ajax) {
      ajax.abort();
    }

    queryString = queryString + outcomeFilterQuery;
    var that = this;

    ajax = $.getJSON('/api/allegations/?' + queryString, function (data) {
      that.changeComplaintList(data.allegations);
    })

    // OutcomeAnalysisAPI.getAnalysisInformation();
  },

  changeComplaintList: function(complaints) {
    _state['complaints'] = complaints;
    OutcomeAnalysisAPI.getAnalysisInformation();
    ComplaintListStore.emitChange();
  },

  setAnalysisInformation: function(data) {
    _state.analytics = data;
    this.emitChange();
  },

  setActiveFilter: function(activeFilter) {
    _state['activeFilter'] = activeFilter;
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

  getState: function (type) {
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
      ComplaintListStore.setActiveFilter(action.filter);
      ComplaintListStore.update();
      break;

    case AppConstants.RECEIVED_OUTCOME_FILTER_ANALYSIS:
      ComplaintListStore.setAnalysisInformation(action.data['analytics']);
      break;

    default:
      break;
  }
});

module.exports = ComplaintListStore;
