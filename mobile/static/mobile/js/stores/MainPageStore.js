var objectAssign = require('object-assign');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var _state = {
  isSearchFocused: 0
};

var MainPageStore = objectAssign(Base(_state), {});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SEARCH_FOCUS:
      MainPageStore.updateState('isSearchFocused', 1);
      MainPageStore.emitChange();
      break;

    case AppConstants.SEARCH_BLUR:
      MainPageStore.updateState('isSearchFocused', 0);
      MainPageStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = MainPageStore;
