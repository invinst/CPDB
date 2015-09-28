var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Base = require('stores/Base');
var FilterStore = require('../stores/FilterStore');
var MapStore = require('../stores/MapStore');
var OfficerListStore = require('../stores/OfficerListStore');

var _state = {
  'data': {
    'new': true,
    'title': '',
    'hash': '',
    'query': {}
  }
};

var SessionStore = _.assign(Base(_state), {
  updateSession: function(data) {
    _state['data'] =_.assign(_state['data'], data);
    this.emitChange();
  },

  getHash: function() {
    return _state['data']['hash'];
  }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SAVE_SESSION:
      SessionStore.updateSession(action.data);
      break;

    case AppConstants.RECEIVED_SESSION_DATA:
    case AppConstants.RECEIVED_UPDATED_SESSION_DATA:
      _state['data'] = action.data.data;
      SessionStore.emitChange();
      break;
    default: break;
  }
});

module.exports = SessionStore;
