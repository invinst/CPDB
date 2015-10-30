var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var _ = require('lodash');
var Base = require('../Base');

var _state = {
  active: 'All'
};

var TabsStore = _.assign(Base(_state), {

});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.SET_DOCUMENT_ACTIVE_TAB:
      _state.active = action.data;
      TabsStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = TabsStore;
