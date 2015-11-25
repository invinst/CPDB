var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');

var ENTER_EVENT = 'ENTER_EVENT';
var LEAVE_EVENT = 'LEAVE_EVENT';

var _state = {
  embedMode: false,
}


var EmbedStore = _.assign(Base(_state), {

  addEnterListener: function (callback) {
    this.on(ENTER_EVENT, callback);
  },

  emitEnter: function () {
    this.emit(ENTER_EVENT);
  },

  addLeaveListener: function (callback) {
    this.on(LEAVE_EVENT, callback);
  },

  removeLeaveListener: function (callback) {
    this.removeListener(LEAVE_EVENT, callback);
  },

  removeEnterListener: function (callback) {
    this.removeListener(ENTER_EVENT, callback);
  },

  emitLeave: function () {
    this.emit(LEAVE_EVENT);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
  case AppConstants.ENTER_EMBED_MODE:
    _state.embedMode = true;
    EmbedStore.emitEnter();
    EmbedStore.emitChange();
    break;

  case AppConstants.LEAVE_EMBED_MODE:
    _state.embedMode = false;
    EmbedStore.emitLeave();
    EmbedStore.emitChange();
    break;

  default:
    break;
  }
});

EmbedStore.setMaxListeners(0);
module.exports = EmbedStore;
