var objectAssign = require('object-assign');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var _state = {
  'focus': 0
};

var SearchablePageStore = objectAssign(Base(_state), {});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SEARCH_FOCUS:
      SearchablePageStore.updateState('focus', 1);
      SearchablePageStore.emitChange();
      break;

    case AppConstants.SEARCH_BLUR:
    case AppConstants.SEARCH_CLEAR:
    case AppConstants.RESET_STATE:
      SearchablePageStore.updateState('focus', 0);
      SearchablePageStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = SearchablePageStore;
