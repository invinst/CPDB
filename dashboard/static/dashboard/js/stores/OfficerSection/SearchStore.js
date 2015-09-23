var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var _ = require('lodash');
var Base = require('../Base');

var _state = {
  query: ''
};

var SearchStore = _.assign(Base(_state), {
  getQuery: function () {
    return {
      q: _state.query
    }
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
  case AppConstants.SEARCH_OFFICER_WITH_QUERY:
    SearchStore.updateState('query', action.data);
    SearchStore.emitChange();
    break;

  default:
    break;
  }
});

module.exports = SearchStore;
