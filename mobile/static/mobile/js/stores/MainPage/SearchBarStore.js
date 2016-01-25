var objectAssign = require('object-assign');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var SearchBarStore = objectAssign(Base({
  status: 'blank',
  term: ''
}), {});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SEARCH_INPUT_CHANGED:
      SearchBarStore.updateState('term', action.data);
      SearchBarStore.emitChange();
      break;

    case AppConstants.SEARCH_BLUR:
      SearchBarStore.updateState('status', 'blank');
      SearchBarStore.emitChange();
      break;

    case AppConstants.SEARCH_FOCUS:
      SearchBarStore.updateState('status', 'focus');
      SearchBarStore.emitChange();
      break;

    case AppConstants.SEARCH_CLEAR:
      SearchBarStore.updateState('status', 'blank');
      SearchBarStore.updateState('term', '');
      SearchBarStore.emitChange();
      break;

    case AppConstants.MAIN_PAGE_RECEIVED_DATA:
    case AppConstants.MAIN_PAGE_FAILED_TO_RECEIVED_DATA:
      SearchBarStore.updateState('term', action.query);
      SearchBarStore.updateState('status', 'focus');
      SearchBarStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = SearchBarStore;
