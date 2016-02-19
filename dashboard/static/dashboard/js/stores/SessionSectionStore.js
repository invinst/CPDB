var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Base = require('./Base');

var _state = {
  active: 'all'
};

var SessionSectionStore = _.assign(Base(_state), {

});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SET_SESSION_ACTIVE_TAB:
      _state.active = action.data;
      SessionSectionStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = SessionSectionStore;
