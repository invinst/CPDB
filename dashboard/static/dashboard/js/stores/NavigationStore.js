var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');


var _state = {
  'activeItem': 0
};


var NavigationStore = assign({}, EventEmitter.prototype, {
  getState: function () {
    return _state;
  },

  setActiveItem: function (i) {
    _state['activeItem'] = i;
    this.emitChange();
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


AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SET_ACTIVE_NAV_ITEM:
      NavigationStore.setActiveItem(action.activeItem);
      break;

    default:
      break;
  }
});

module.exports = NavigationStore;
