var objectAssign = require('object-assign');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var _state = {
  status: 'blank',
  term: ''
};

var SearchBarStore = objectAssign(Base(_state), {});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SEARCH_INPUT_CHANGED:
      _state['term'] = action.data;
      SearchBarStore.emitChange();
      break;

    case AppConstants.SEARCH_BLUR:
      _state['status'] = 'blank';
      _state['term'] = '';
      SearchBarStore.emitChange();
      break;

    case AppConstants.SEARCH_FOCUS:
      _state['status'] = 'focus';
      _state['term'] = '';
      SearchBarStore.emitChange();
      break;

    case AppConstants.SEARCH_CLEAR:
      _state['status'] = 'blank';
      _state['term'] = '';
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
