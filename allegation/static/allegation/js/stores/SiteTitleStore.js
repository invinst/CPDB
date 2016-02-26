var _ = require ('lodash');
var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var Base = require('stores/Base');

var _state = {
  siteTitle: AppConstants.DEFAULT_SITE_TITLE
};

var SiteTitleStore = _.assign(Base(_state), {
  getSiteTitle: function () {
    return _state.siteTitle;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.CHANGE_SITE_TITLE:
      _state.siteTitle = action.title;
      SiteTitleStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = SiteTitleStore;
