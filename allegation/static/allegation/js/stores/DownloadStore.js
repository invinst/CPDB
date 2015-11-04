var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var FilterStore = require('stores/FilterStore');
var OfficerListStore = require('stores/OfficerListStore');
var Base = require('stores/Base');

var _state = {
  processing: false,
  href: false,
  query: null
};

var DownloadStore = _.assign(Base(_state), {

});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.DOWNLOAD_PROCESS:
      _state.processing = true;
      DownloadStore.emitChange();
      break;

    case AppConstants.GENERATED_DOWNLOAD:
      _state.href = action.href;
      _state.processing = false;
      DownloadStore.emitChange()
      break;

    case AppConstants.ADD_TAG:
    case AppConstants.REMOVE_TAG:
    case AppConstants.TOGGLE_TAGS:
    case AppConstants.SET_ACTIVE_OFFICER:
    case AppConstants.RECEIVED_SESSION_DATA:
      AppDispatcher.waitFor([OfficerListStore.dispatchEvent]);
      _state.href = false;
      _state.processing = false;
      _state.query = OfficerListStore.getQueryString();
      DownloadStore.emitChange();

    default:
      break;
  }
});

module.exports = DownloadStore;
