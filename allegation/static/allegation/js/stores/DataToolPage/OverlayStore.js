var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var AppConstants = require('../../constants/AppConstants');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var ShareButtonStore = require('stores/DataToolPage/ShareButtonStore');

var _state = {
  active: false
};

var events = {
  CHANGE_EVENT: 'change'
};


var OverlayStore = _.assign({}, EventEmitter.prototype, {
  addChangeListener: function (callback) {
    this.on(events.CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(events.CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(events.CHANGE_EVENT);
  },

  getState: function () {
    return _state;
  }
});

OverlayStore.dispatcherToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.TOGGLE_OVERLAY:
      _state.active = !_state.active;
      OverlayStore.emitChange();
      break;

    case AppConstants.CLOSE_SHARE_BAR:
      AppDispatcher.waitFor([ShareButtonStore.dispatcherIndex]);
      _state.active = false;
      OverlayStore.emitChange();
      break;

    case AppConstants.RECEIVED_SHARED_SESSION:
      AppDispatcher.waitFor([ShareButtonStore.dispatcherIndex]);
      _state.active = true;
      OverlayStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = OverlayStore;
