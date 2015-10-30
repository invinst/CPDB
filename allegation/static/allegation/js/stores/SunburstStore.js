var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
var FilterStore = require('./FilterStore');
var CHANGE_EVENT = 'change';
var ajax = null;

var root = null;
var _queryString = null;

var SunburstStore = assign({}, EventEmitter.prototype, {
  update: function (query) {
    var filter = FilterStore.getQueryString(['final_outcome', 'final_finding', 'outcome_text', 'final_finding_text']);
    var queryString = query || filter;
    if (queryString == _queryString) {
      return;
    }
    _queryString = queryString;
    if (ajax) {
      ajax.abort();
    }
    ajax = d3.json("/api/allegations/sunburst/?" + queryString, function (error, data) {
      if (error) throw error;
      SunburstStore.setData(data);
    });
  },

  setData: function (data) {
    root = data.sunburst;
    SunburstStore.emitChange();
  },

  init: function (query) {
    this.update(query);
  },

  getRoot: function () {
    return root;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
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
      SunburstStore.update();
      break;
    default:
      break;
  }
});

module.exports = SunburstStore;
