var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var ajax = null;
var assign = require('object-assign');
var _ = require('lodash');

var _state = {
  'complaints': [],
  'activeFilter': 'all',
  'analytics': [],
  'activeComplaints': [],
  'scrollLock': false,
  'pageNumber': 1,
  'loading': false,
  'noQuery': true
};

var ComplaintListStore = assign({}, EventEmitter.prototype, {
  setAnalysisInformation: function(data) {
    _state.analytics = data;
    this.emitChange();
  },

  getActiveFilter: function() {
    return _state['activeFilter'];
  },

  setActiveFilter: function(activeFilter) {
    _state['activeFilter'] = activeFilter;
  },

  lockScroll: function() {
    _state['scrollLock'] = true;
    this.emitChange();
  },

  unlockScroll: function() {
    _state['scrollLock'] = false;
  },

  getState: function () {
    return _state;
  },

  addChangeListener: function (callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(AppConstants.CHANGE_EVENT);
  }
});


AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER:
      ComplaintListStore.setActiveFilter(action.filter);
      _state['pageNumber'] = 1;
      ComplaintListStore.emitChange();
      break;

    case AppConstants.RECEIVED_OUTCOME_FILTER_ANALYSIS:
      ComplaintListStore.setAnalysisInformation(action.data['analytics']);
      break;

    case AppConstants.COMPLAINT_LIST_RECEIVED_MORE_DATA:
      if (!_.isEmpty(action.data.allegations)) {
        ComplaintListStore.unlockScroll();
        _state['pageNumber']++;
        $.merge(_state['complaints'], action.data.allegations);
        ComplaintListStore.emitChange();
      }
      break;

    case AppConstants.COMPLAINT_LIST_GET_DATA:
      _state['loading'] = true;
      ComplaintListStore.emitChange();
      break;

    case AppConstants.COMPLAINT_LIST_RECEIVED_DATA:
      _state['complaints'] = action.data.allegations;
      _state['analytics'] = action.data.analytics;
      _state.noQuery = action.data.noQuery;
      _state['loading'] = false;
      _state['pageNumber'] = 1;
      ComplaintListStore.emitChange();
      break;

    case AppConstants.TOGGLE_COMPLAINT:
      if (_state['activeComplaints'].indexOf(action.id) > -1) {
        _state['activeComplaints'].splice(_state['activeComplaints'].indexOf(action.id), 1);
      }
      else{
        _state['activeComplaints'].push(action.id);
      }
      ComplaintListStore.emitChange();
      break;

    case AppConstants.RECEIVED_SESSION_DATA:
      var data = action.data.data;
      _state['activeComplaints'] = data['query']['activeComplaints'] || [];
      ComplaintListStore.emitChange();
      break;

    default:
      break;
  }
});
ComplaintListStore.setMaxListeners(0);
module.exports = ComplaintListStore;
