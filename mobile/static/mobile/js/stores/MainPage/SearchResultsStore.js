var objectAssign = require('object-assign');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var SearchResultsStore = objectAssign(Base({
  suggestions: [],
  term: '',
  success: false,
  searching: 0
}), {});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.MAIN_PAGE_RECEIVED_DATA:
      SearchResultsStore.updateState('searching', 0);
      SearchResultsStore.updateState('suggestions', action.data);
      SearchResultsStore.updateState('success', true);
      SearchResultsStore.updateState('term', action.query);
      SearchResultsStore.emitChange();
      break;

    case AppConstants.MAIN_PAGE_FAILED_TO_RECEIVED_DATA:
      SearchResultsStore.updateState('searching', 0);
      SearchResultsStore.updateState('success', false);
      SearchResultsStore.updateState('term', action.query);
      SearchResultsStore.emitChange();
      break;

    case AppConstants.SEARCH_INPUT_CHANGED:
      SearchResultsStore.updateState('term', action.data);
      SearchResultsStore.updateState('searching', 1);
      SearchResultsStore.emitChange();
      break;

    case AppConstants.SEARCH_CLEAR:
      SearchResultsStore.updateState('term', '');
      SearchResultsStore.updateState('suggestions', []);
      SearchResultsStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = SearchResultsStore;
