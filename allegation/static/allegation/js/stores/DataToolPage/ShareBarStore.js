var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('../Base');

var _state = {
  active: false,
  sharedSessionHashId: null
};

var ShareBarStore = _.assign(Base(_state), {
  getSharedSessionHashId: function () {
    return _state['sharedSessionHashId'];
  },

  setActive: function (active) {
    _state.active = !!active;
  },

  isActive: function () {
    return _state.active;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.CLOSE_SHARE_BAR:
      ShareBarStore.setActive(false);
      ShareBarStore.emitChange();
      break;

    case AppConstants.RECEIVED_SHARED_SESSION:
      ShareBarStore.setActive(true);
      _state.sharedSessionHashId = action.data.data.hash;
      ShareBarStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = ShareBarStore;
