var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var _ = require('lodash');
var Base = require('../Base');

var _state = {
  data: [],
  locked: false,
  page: 1,
  sortBy: []
};

var QueryListStore = _.assign(Base(_state), {
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
  case AppConstants.RECEIVED_SEARCH_RESULTS_DATA:
    QueryListStore.updateState('data', action.data);
    QueryListStore.emitChange();
    break;

  case AppConstants.LOAD_MORE_SEARCH_RESULTS_DATA:
    if (!_.isEmpty(action.data)) {
      var data = QueryListStore.getState()['data'].concat(action.data);
      var page = QueryListStore.getState()['page'];
      QueryListStore.updateState('data', data);
      QueryListStore.updateState('locked', false);
      QueryListStore.updateState('page', page + 1);
      QueryListStore.emitChange();
    }
    break;

  case AppConstants.LOCK_SCROLL:
    QueryListStore.updateState('locked', true);
    QueryListStore.emitChange();
    break;

  case AppConstants.SORT_QUERY_LIST:
    QueryListStore.updateState('sortBy', action.data);
    break;

  default:
    break;
  }
});

module.exports = QueryListStore;
