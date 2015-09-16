var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var _state = {
  'activeItemText': ''
}

var PageTitleStore = assign({}, EventEmitter.prototype, {
  getState: function() {
    return _state;
  },

  addChangeListener: function(callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  emitChange: function() {
    this.emit(AppConstants.CHANGE_EVENT);
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
  case AppConstants.SET_ACTIVE_NAV_ITEM:
    _state['activeItemText'] = AppConstants.NAVIGATION_ITEMS[action.activeItem].text;
    break;
  default:
    break;
  }
  PageTitleStore.emitChange();
});

module.exports = PageTitleStore;
