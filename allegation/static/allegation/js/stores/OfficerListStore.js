var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');

var CHANGE_EVENT = 'change';
var SUMMARY_CHANGE = 'summary-change';
var firstCall = true;
var ajax = null;
var _state = {
  'active_officers': []
};


var OfficerListStore = assign({}, EventEmitter.prototype, {
  getSession: function () {
    return {'active_officers': _.clone(_state['active_officers'])};
  },

  setSession: function (data) {
    this.set('active_officers', data['active_officers'] || []);
  },

  getActiveOfficers: function () {
    return _state['active_officers'];
  },

  update: function (query) {
    var queryString = query || AllegationFilterTagsQueryBuilder.buildQuery();

    if (ajax) {
      ajax.abort();
    }

    _state.filtered = queryString;

    ajax = $.getJSON('/api/officer-allegations/officers/?' + queryString, function (data) {
      _state.officers = data.officers;
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

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  addSummaryListener: function (callback) {
    this.on(SUMMARY_CHANGE, callback);
  }

});


// Register callback to handle all updates
OfficerListStore.dispatchEvent = AppDispatcher.register(function (action) {
  var index,
    data;

  switch (action.actionType) {
    case AppConstants.MAP_REPLACE_FILTERS:
    case AppConstants.MAP_CHANGE_FILTER:
    case AppConstants.MAP_ADD_FILTER:
    case AppConstants.ADD_TAG:
    case AppConstants.SAVE_TAGS:
    case AppConstants.REMOVE_TAG:
    case AppConstants.TOGGLE_TAGS:
    case AppConstants.SUNBURST_SELECT_ARC:
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
      _state.complaintsCountStart = action.start;
      _state.complaintsCountEnd = action.end;
      OfficerListStore.update();
      break;

    case AppConstants.SET_ACTIVE_OFFICER:
      index = _state['active_officers'].indexOf(action.officer.id);
      if (index == -1) {
        _state['active_officers'].push(action.officer.id);
      }
      else {
        _state['active_officers'].splice(index, 1);
      }
      OfficerListStore.emitChange();
      break;

    case AppConstants.RECEIVED_SESSION_DATA:
      data = action.data.data;
      _state['active_officers'] = data['query']['active_officers'] || [];
      OfficerListStore.update();
      OfficerListStore.emitChange();
      break;

    default:
      break;
  }
  if (firstCall) {
    OfficerListStore.update();
    firstCall = false;
  }
});

module.exports = OfficerListStore;
