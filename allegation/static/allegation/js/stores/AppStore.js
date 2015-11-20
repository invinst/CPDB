var _ = require('lodash');
var StringUtil = require('utils/StringUtil');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Base = require('../stores/Base');


var INIT_DATA_TOOL_EVENT = 'INIT_DATA_TOOL_EVENT';
var CHANGE_PAGE_EVENT = 'CHANGE_PAGE_EVENT';

var _state = {
  isDataToolInit: true,
  page: 'data',
  session_title: null,
  session_hash: null
};

var AppStore = _.assign(Base(_state), {
  isDataToolInit: function () {
    return _state.isDataToolInit;
  },

  updatePage: function (page) {
    _state.page = page;
    this.emitChange();
  },

  removeDataToolInitListener: function(callback) {
    this.removeListener(INIT_DATA_TOOL_EVENT, callback);
  },

  addDataToolInitListener: function (callback) {
    this.on(INIT_DATA_TOOL_EVENT, callback);
  },

  emitDataToolInit: function () {
    this.emit(INIT_DATA_TOOL_EVENT);
  },

  isPage: function (page) {
    return _state.page == page;
  },

  isStoryPage: function () {
    return this.isPage('story');
  },

  isFindingPage: function () {
    return this.isPage('findings');
  },

  isDataToolPage: function () {
    return this.isPage('data');
  },

  isMethodPage: function () {
    return this.isPage('method');
  },

  removeChangePageListener: function(callback) {
    this.removeListener(CHANGE_PAGE_EVENT, callback);
  },

  addChangePageListener: function (callback) {
    this.on(CHANGE_PAGE_EVENT, callback);
  },

  emitChangePage: function () {
    this.emit(CHANGE_PAGE_EVENT);
  },

  getDataToolUrl: function () {
    if (_state.session_hash) {
      if (_state.session_title) {
        return '/data/' + _state.session_hash + '/' + StringUtil.slugify(_state.session_title);;
      }
      return '/data/' + _state.session_hash + '/';
    }
    return '/data';
  },

});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.INIT_DATA_TOOL:
      if (!_state.isDataToolInit) {
        _state.isDataToolInit = true;
        AppStore.emitDataToolInit();
      }
      break;

    case AppConstants.NAV_GO_TO_PAGE:
      _state.page = action.page;
      AppStore.emitChange();
      AppStore.emitChangePage();
      break;

    case AppConstants.RECEIVED_SESSION_DATA:
    case AppConstants.RECEIVED_UPDATED_SESSION_DATA:
      var data = action.data.data;
      _state.session_title = data.title;
      _state.session_hash = data.hash;
      AppStore.emitChange();
      break;

    case AppConstants.UPDATE_TITLE:
      _state.session_title = action.title;
      AppStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = AppStore;
