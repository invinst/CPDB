var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';
var _state = {
  'activeFilter': 'all'
};


var OutcomeFilterStore = assign({}, EventEmitter.prototype, {
  setActiveFilter: function(activeFilter) {
    _state.activeFilter = activeFilter;
  },

  getState: function () {
    return _state;
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

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER:
      OutcomeFilterStore.setActiveFilter(action.filter);
      OutcomeFilterStore.emitChange();
      break;
    default:
      break;
  }
});

module.exports = OutcomeFilterStore;
