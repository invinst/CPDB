var _ = require('lodash');
var S = require('string');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('../Base');
var locationUtils = require('utils/location');

var _state = {
  active: false,
  sharedSessionHashId: null,
  sharedUrl: null
};

var updateSharedSessionHashId = function (hashId) {
  _state.sharedSessionHashId = hashId;
  _state.sharedUrl = locationUtils.getWindowHref().replace(
    /data\/\w+/,
    S('data/{{hashId}}').template({
      hashId: _state.sharedSessionHashId
    }).s
  );
};

var updateSharedUrlWithSiteTitle = function (siteTitle) {
  _state.sharedUrl = locationUtils.getWindowHref().replace(
    /data\/\w+\/.+/,
    S('data/{{hashId}}/{{slug}}').template({
      hashId: _state.sharedSessionHashId,
      slug: S(siteTitle).slugify().s
    }).s
  );
};

var ShareButtonStore = _.assign(Base(_state), {
  getSharedSessionHashId: function () {
    return _state['sharedSessionHashId'];
  },

  isActive: function () {
    return _state.active;
  },

  dispatcherIndex: AppDispatcher.register(function (action) {
    switch (action.actionType) {
      case AppConstants.CLOSE_SHARE_BAR:
        _state.active = false;
        ShareButtonStore.emitChange();
        break;

      case AppConstants.RECEIVED_SHARED_SESSION:
        _state.active = true;
        updateSharedSessionHashId(action.data.data.hash);
        ShareButtonStore.emitChange();
        break;

      case AppConstants.CHANGE_SITE_TITLE:
        updateSharedUrlWithSiteTitle(action.title);
        ShareButtonStore.emitChange();
        break;

      default:
        break;
    }
  })
});

module.exports = ShareButtonStore;
