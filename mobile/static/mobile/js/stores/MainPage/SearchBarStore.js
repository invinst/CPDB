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
    case AppConstants.SEARCH_FOR:
      _state['term'] = action.data;
      _state['searchStatus'] = 'suggesting';
      SearchBarStore.emitChange();
      break;

    case AppConstants.SEARCH_BLUR:
      _state['status'] = 'blank';
      _state['term'] = '';
      SearchBarStore.emitChange();
      break;

    case AppConstants.SEARCH_FOCUS:
      _state['status'] = 'focus';
      SearchBarStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = SearchBarStore;
