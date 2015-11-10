var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Base = require('../stores/Base');


var _state = {
  'searchExpanded': false
};

var NavStore = _.assign(Base(_state), {

});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.MOBILE_SEARCH_CLICK:
      _state.searchExpanded = true;
      NavStore.emitChange();
      break;

    case AppConstants.MOBILE_SEARCH_COLLAPSE:
      _state.searchExpanded = false;
      NavStore.emitChange();
      break;

    default: break;
  }
});

module.exports = NavStore;
