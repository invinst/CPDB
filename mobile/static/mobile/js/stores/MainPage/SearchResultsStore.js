var objectAssign = require('object-assign');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var _state = {
  suggestions: [],
  term: '',
  success: false
};

var SearchResultsStore = objectAssign(Base(_state), {});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.MAIN_PAGE_RECEIVED_DATA:
      SearchResultsStore.updateState('suggestions', action.data);
      SearchResultsStore.updateState('success', true);
      SearchResultsStore.emitChange();
      break;

    case AppConstants.MAIN_PAGE_FAILED_TO_RECEIVED_DATA:
      SearchResultsStore.updateState('success', false);
      SearchResultsStore.emitChange();
      break;

    case AppConstants.SEARCH_INPUT_CHANGED:
      SearchResultsStore.updateState('term', action.data);
      SearchResultsStore.emitChange();
      break;

    case AppConstants.SEARCH_CLEAR:
      SearchResultsStore.updateState('term', '');
      SearchResultsStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = SearchResultsStore;
