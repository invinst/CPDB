var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var _state = {
  searchStatus: 'blank',
  searchTerm: ''
};

var MainPageStore = _.assign(Base(_state), {});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.ACTIVATE_SEARCH:
      _state['searchStatus'] = 'suggesting';
      MainPageStore.emitChange();
      break;

    case AppConstants.DEACTIVATE_SEARCH:
      if (!_state['searchTerm']) {
        _state['searchStatus'] = 'blank';
      }
      MainPageStore.emitChange();
      break;

    case AppConstants.SEARCH_FOR:
      _state['searchTerm'] = action.data;
      _state['searchStatus'] = 'suggesting';
      MainPageStore.emitChange();
      break;

    case AppConstants.GO_FOR_SEARCH_DETAIL:
      _state['searchStatus'] = 'results';
      MainPageStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = MainPageStore;
