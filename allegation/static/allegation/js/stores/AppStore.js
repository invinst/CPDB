var _ = require('lodash');
var StringUtil = require('utils/StringUtil');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Base = require('../stores/Base');

var CHANGE_PAGE_EVENT = 'CHANGE_PAGE_EVENT';
var CHANGE_SESSION_EVENT = 'CHANGE_SESSION_EVENT';

var _state = {
  page: 'data',
  sessionTitle: null,
  sessionHash: null
};


var AppStore = _.assign(Base(_state), {
  updatePage: function (page) {
    _state.page = page;
    this.emitChange();
  },

  isPage: function (page) {
    return _state.page == page;
  },

  isDataToolPage: function () {
    return this.isPage('data');
  },

  removeChangePageListener: function (callback) {
    this.removeListener(CHANGE_PAGE_EVENT, callback);
  },

  addChangePageListener: function (callback) {
    this.on(CHANGE_PAGE_EVENT, callback);
  },

  emitChangePage: function () {
    this.emit(CHANGE_PAGE_EVENT);
  },

  emitChangeSession: function () {
    this.emit(CHANGE_SESSION_EVENT);
  },

  removeChangeSessionListener: function (callback) {
    this.removeListener(CHANGE_SESSION_EVENT, callback);
  },

  addChangeSessionListener: function (callback) {
    this.on(CHANGE_SESSION_EVENT, callback);
  },

  getNavTabUrl: function (navTab) {
    if (navTab == 'data') {
      return this.getDataToolUrl();
    }
    return '/' + navTab + '/';
  },

  getDataToolUrl: function () {
    if (_state.sessionHash) {
      if (_state.sessionTitle) {
        return '/data/' + _state.sessionHash + '/' + StringUtil.slugify(_state.sessionTitle);
      }
      return '/data/' + _state.sessionHash + '/';
    }
    return '/data';
  }
});

// Register callback to handle all updates
AppStore.dispatcherToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.NAV_GO_TO_PAGE:
      _state.page = action.page;
      AppStore.emitChange();
      AppStore.emitChangePage();
      break;

    case AppConstants.RECEIVED_SESSION_DATA:
    case AppConstants.RECEIVED_UPDATED_SESSION_DATA:
      AppDispatcher.waitFor([AppStore.sessionDispatcherToken]);
      var data = action.data.data;
      _state.sessionTitle = data.title;
      _state.sessionHash = data.hash;
      AppStore.emitChangeSession();
      AppStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = AppStore;
