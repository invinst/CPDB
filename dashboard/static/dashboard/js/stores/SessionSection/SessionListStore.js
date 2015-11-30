var _ = require('lodash');

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var Base = require('stores/Base');

var _state = {
  locked: false,
  data: []
};

var SessionListStore = _.assign(Base(_state), {
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_SESSIONS_DATA:
      _state['data'] = action.data['results'];
      _state['locked'] = false;

      SessionListStore.emitChange();
      break;

    case AppConstants.LOCK_SESSION_PAGE_SCROLL:
      _state['locked'] = true;
      SessionListStore.emitChange();
      break;

    case AppConstants.RECEIVED_MORE_SESSIONS_DATA:
      if (!_.isEmpty(action.data)) {
        var data = _state['data'].concat(action.data);
        _state['data'] = data;
        _state['locked'] = false;
        SessionListStore.emitChange();
      }
      break;

    case AppConstants.TOGGLED_SEARCHABLE_SESSION:
      var data = action.data;
      var hashID = data['hash_id'];
      var enable = data['enable'];
      for (i in _state['data']) {
        if (_state['data'][i].hash_id == hashID) {
          _state['data'][i].searchable = enable;
          break;
        }
      }
      SessionListStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = SessionListStore;
