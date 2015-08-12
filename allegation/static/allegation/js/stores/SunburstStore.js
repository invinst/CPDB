var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MapConstants = require('../constants/MapConstants');
var assign = require('object-assign');
var FilterStore = require('./FilterStore');
var CHANGE_EVENT = 'change';

var _state = {
  'rows': [],
  'current': false,
  selected: false
};
var _complaints = {};
var _currentActive = false;

var _queryString = null;

var SunburstStore = assign({}, EventEmitter.prototype, {
  update: function () {
    var queryString = FilterStore.getQueryString(['final_outcome', 'final_finding']);
    if (queryString == _queryString) {
      return;
    }
    _queryString = queryString;

    d3.json("/api/allegations/sunburst/?" + queryString, function (error, data) {
      if (error) throw error;
      var root = data.sunburst;
      _state = {
        data: root,
        selected: root,
        drew: false
      };
      SunburstStore.emitChange();
    });
  },
  set: function (key, value) {
    _state[key] = value;
  },
  setCurrentActive: function(val){
    _currentActive = val;
    SunburstStore.emitChange();
  },
  getCurrentActive: function(){
    return _currentActive;
  },
  init: function () {
    this.update();
    return _state;
  },
  getAll: function (type) {
    return _state;
  },
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  }

});

// Register callback to handle all updates
AppDispatcher.register(function (action) {

  switch (action.actionType) {
    case MapConstants.MAP_REPLACE_FILTERS:
    case MapConstants.MAP_CHANGE_FILTER:
    case MapConstants.MAP_ADD_FILTER:
      SunburstStore.update();
      break;
    default:
      break;
  }
});

module.exports = SunburstStore;
