var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppConstants = require('../../constants/AppConstants');
var AppDispatcher = require('../../dispatcher/AppDispatcher');

var _state = {
  'period': 'day'
};


var PeriodPickerStore = assign({}, EventEmitter.prototype, {
  getState: function () {
    return _state;
  },

  addChangeListener: function (callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(AppConstants.CHANGE_EVENT);
  }
});


PeriodPickerStore.dispatch = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SET_PERIOD:
      _state['period'] = action.period;
      PeriodPickerStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = PeriodPickerStore;
