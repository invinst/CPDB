var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');

var Base = require('stores/Base');
var OfficerListStore = require('stores/OfficerListStore');

var AllegationFetcherQueryBuilder = require('utils/querybuilders/AllegationFetcherQueryBuilder');

var _state = {
  processing: false,
  href: false,
  query: null
};

var HREF_CHANGE_EVENT = 'HREF_CHANGE_EVENT';


var DownloadStore = _.assign(Base(_state), {
  addHrefChangeListener: function (callback) {
    this.on(HREF_CHANGE_EVENT, callback);
  },

  removeHrefChangeListener: function (callback) {
    this.removeListener(HREF_CHANGE_EVENT, callback);
  },

  emitHrefChange: function () {
    this.emit(HREF_CHANGE_EVENT);
  }
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
      DownloadStore.emitChange();
      DownloadStore.emitHrefChange();
      break;

    case AppConstants.ADD_TAG:
    case AppConstants.REMOVE_TAG:
    case AppConstants.TOGGLE_TAGS:
    case AppConstants.SUNBURST_SELECT_ARC:
    case AppConstants.SAVE_TAGS:
    case AppConstants.SET_ACTIVE_OFFICER:
    case AppConstants.RECEIVED_SESSION_DATA:
      AppDispatcher.waitFor([OfficerListStore.dispatchEvent]);
      _state.href = false;
      _state.processing = false;
      _state.query = AllegationFetcherQueryBuilder.buildAnalysisOutcomeQuery();
      DownloadStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = DownloadStore;
