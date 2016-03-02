var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var _ = require('lodash');
var Base = require('../Base');

var _state = {
  data: [],
  locked: false,
  page: 1,
  sortBy: 'updated_at',
  order: -1
};

var QueryListStore = _.assign(Base(_state), {
  getSortOrder: function () {
    if (_state['sortBy']) {
      return (_state['order'] > 0 ? '' : '-') + _state['sortBy'];
    }
    return '';
  }
});

AppDispatcher.register(function (action) {
  var data,
    page,
    currentSortBy,
    order,
    sortBy;

  switch (action.actionType) {
    case AppConstants.RECEIVED_SEARCH_RESULTS_DATA:
      QueryListStore.updateState('page', 1);
      QueryListStore.updateState('data', action.data);
      QueryListStore.emitChange();
      break;

    case AppConstants.LOAD_MORE_SEARCH_RESULTS_DATA:
      if (!_.isEmpty(action.data)) {
        data = QueryListStore.getState()['data'].concat(action.data);
        page = QueryListStore.getState()['page'];
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
      currentSortBy = QueryListStore.getState()['sortBy'];
      order = QueryListStore.getState()['order'];
      sortBy = action.data;

      if (currentSortBy == sortBy) {
        order = -order;
      }

      QueryListStore.updateState('sortBy', action.data);
      QueryListStore.updateState('order', order);
      QueryListStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = QueryListStore;
