var _ = require('lodash');

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var Base = require('stores/Base');

var _state = {
  query: ''
};

var SessionSearchStore = _.assign(Base(_state), {
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SEARCH_FOR_SESSION:
      _state['query'] = action.data;
      break;
    default:
      break;
  }
});

module.exports = SessionSearchStore;
