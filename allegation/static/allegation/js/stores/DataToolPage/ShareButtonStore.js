var _ = require('lodash');
var S = require('string');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('../Base');

var _state = {
  active: false,
  sharedSessionHashId: null,
  sharedUrl: null
};

var ShareButtonStore = _.assign(Base(_state), {
  getSharedSessionHashId: function () {
    return _state['sharedSessionHashId'];
  },

  setActive: function (active) {
    _state.active = !!active;
  },

  updateSharedSessionHashId: function (hashId) {
    _state.sharedSessionHashId = hashId;
    _state.sharedUrl = window.location.href.replace(
      /data\/\w+/,
      S('data/{{hashId}}').template({
        hashId: _state.sharedSessionHashId
      }).s
    );
  },

  updateSharedUrlWithSiteTitle: function (siteTitle) {
    _state.sharedUrl = window.location.href.replace(
      /data\/\w+\/.+/,
      S('data/{{hashId}}/{{slug}}').template({
        hashId: _state.sharedSessionHashId,
        slug: S(siteTitle).slugify().s
      }).s
    );
  },

  isActive: function () {
    return _state.active;
  },

  dispatcherIndex: AppDispatcher.register(function (action) {
    switch (action.actionType) {
      case AppConstants.CLOSE_SHARE_BAR:
        ShareButtonStore.setActive(false);
        ShareButtonStore.emitChange();
        break;

      case AppConstants.RECEIVED_SHARED_SESSION:
        ShareButtonStore.setActive(true);
        ShareButtonStore.updateSharedSessionHashId(action.data.data.hash);
        ShareButtonStore.emitChange();
        break;

      case AppConstants.CHANGE_SITE_TITLE:
        ShareButtonStore.updateSharedUrlWithSiteTitle(action.siteTitle);
        ShareButtonStore.emitChange();
        break;

      default:
        break;
    }
  })
});

module.exports = ShareButtonStore;
