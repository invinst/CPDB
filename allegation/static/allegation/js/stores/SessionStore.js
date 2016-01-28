var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Base = require('stores/Base');
var FilterTagStore = require('../stores/FilterTagStore');
var MapStore = require('../stores/MapStore');
var OfficerListStore = require('../stores/OfficerListStore');
var OfficerPresenter = require('presenters/OfficerPresenter');
var AppStore = require('stores/AppStore');

var _state = {
  'data': {
    'new': true,
    'title': '',
    'hash': '',
    'query': {},
    'active_tab': ''
  },
  'siteTitle': AppConstants.DEFAULT_SITE_TITLE
};

var SESSION_CREATED_EVENT = 'SESSION_CREATED_EVENT';
var SessionStore = _.assign(Base(_state), {
  updateSession: function(data) {
    _state['data'] = _.assign(_state['data'], data);
    this.emitChange();
  },

  getHash: function() {
    return _state['data']['hash'];
  },

  getActiveTab: function () {
    return _state['data']['active_tab'];
  },

  isNoQuery: function () {
    return _.isEmpty(_state.data.query.active_officers) && _.isEmpty(_state.data.query.filters);
  },

  removeSessionCreatedListener: function(callback) {
    this.removeListener(SESSION_CREATED_EVENT, callback);
  },

  addSessionCreatedListener: function (callback) {
    this.on(SESSION_CREATED_EVENT, callback);
  },

  emitSessionCreated: function () {
    this.emit(SESSION_CREATED_EVENT);
  },
});

// Register callback to handle all updates
SessionStore.dispatcherToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SAVE_SESSION:
    // SessionStore.updateSession(action.data);
    SessionStore.emitChange();
      break;

    case AppConstants.RECEIVED_SESSION_DATA:
      var data = action.data.data;
      data['title'] = data['title'] || AppConstants.DEFAULT_SITE_TITLE;
      _state['data'] = data;
      _state.siteTitle = data.title;
      _state['data']['active_tab'] = data.active_tab;
      SessionStore.emitChange();
      break;

    case AppConstants.UPDATE_TITLE:
      var title = action.title;
      _state['data']['title'] = title;
      _state.siteTitle = title;
      SessionStore.emitChange();
      break;

    case AppConstants.RECEIVED_UPDATED_SESSION_DATA:
      _state['data'] = action.data.data;
      _state.siteTitle = _state['data'].title;
      SessionStore.emitChange();
      break;

    case AppConstants.ADD_TAG:
      SessionStore.emitChange();
      break;

    case AppConstants.REMOVE_TAG:
      SessionStore.emitChange();
      break;

    case AppConstants.SET_ACTIVE_TAB:
      _state['active_tab'] = action.data;
      break;

    case AppConstants.SESSION_CREATED:
      SessionStore.emitSessionCreated();
      break;

    default: break;
  }
});

AppStore.sessionDispatcherToken = SessionStore.dispatcherToken;

module.exports = SessionStore;
