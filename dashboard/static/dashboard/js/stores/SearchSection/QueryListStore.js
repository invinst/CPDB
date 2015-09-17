var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var _ = require('lodash');
var Base = require('../Base');

var _state = {
  logs: []
};

var QueryListStore = _.assign(Base(_state), {
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
  case AppConstants.RECEIVED_QUERIES_DATA:
    QueryListStore.updateState('logs', action.data.logs);
    QueryListStore.updateState('logCounts', action.data.log_counts);
    QueryListStore.emitChange();
    break;
  default:
    break;
  }
});

module.exports = QueryListStore;
