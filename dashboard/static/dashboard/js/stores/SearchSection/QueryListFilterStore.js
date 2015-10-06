var Base = require('../Base');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var _ = require('lodash');

var _state = {
  'activeItem': 'all',
  query: ''
};

var QueryListFilterStore = _.assign(Base(_state), {
});

QueryListFilterStore.dispatchEvent = AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.SET_QUERY_LIST_ACTIVE_ITEM:
      QueryListFilterStore.updateState('activeItem', action.data);
      QueryListFilterStore.emitChange();
      break;

    default: break;
  }
});

module.exports = QueryListFilterStore;
