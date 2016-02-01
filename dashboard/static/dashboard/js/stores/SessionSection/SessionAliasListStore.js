var _ = require('lodash');
var toastr = require('toastr');

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var Base = require('stores/Base');

var _state = {
  locked: false,
  data: []
};

var SessionListStore = _.assign(Base(_state), {
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_SESSIONS_ALIAS_DATA:
      _state['data'] = action.data['results'];
      _state['locked'] = false;

      SessionListStore.emitChange();
      break;

    case AppConstants.LOCK_SESSION_ALIAS_PAGE_SCROLL:
      _state['locked'] = true;
      SessionListStore.emitChange();
      break;

    case AppConstants.RECEIVED_MORE_SESSIONS_ALIAS_DATA:
      if (!_.isEmpty(action.data)) {
        var data = _state['data'].concat(action.data);
        _state['data'] = data;
        _state['locked'] = false;
        SessionListStore.emitChange();
      }
      break;

    case AppConstants.DELETED_SESSION_ALIAS:
      var alias = action.data;
      toastr.error('Delete alias successfully.');
      _state.data.splice(_state.data.indexOf(alias), 1);
      SessionListStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = SessionListStore;
