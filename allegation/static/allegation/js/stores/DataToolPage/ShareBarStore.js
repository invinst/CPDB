var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('../Base');

var _state = {
  sharedSessionHashId: null
};

var ShareBarStore = _.assign(Base(_state), {
  getSharedSessionHashId: function () {
    return _state['sharedSessionHashId'];
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_SHARED_SESSION:
      _state.sharedSessionHashId = action.data.data.hash;
      ShareBarStore.emitChange();
      break;
    default:
      break;
  }
});

module.exports = ShareBarStore;
