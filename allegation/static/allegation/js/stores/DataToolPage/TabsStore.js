var _ = require('lodash');

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var MobileUtils = require('utils/MobileUtils');
var Base = require('../Base');

var defaultTab = function () {
  return MobileUtils.isMobileView() ? 'map' : 'outcomes';
};

var ifNotMobileChangeMapToOutcome = function (tab) {
  if (!MobileUtils.isMobileView() && tab == 'map')
    return 'outcomes';
  return tab;
};

var _state = {
  activeTab: defaultTab()
};

var TabsStore = _.assign(Base(_state), {
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_SESSION_DATA:
      if (action.data.data.active_tab) {
        _state.activeTab = ifNotMobileChangeMapToOutcome(action.data.data.active_tab);
      } else {
        _state.activeTab = defaultTab();
      }
      TabsStore.emitChange();
      break;
    case AppConstants.SESSION_CREATED:
      _state.activeTab = defaultTab();
      TabsStore.emitChange();
      break;
    case AppConstants.SET_ACTIVE_TAB:
      _state.activeTab = action.data;
      TabsStore.emitChange();
      break;
    default:
      break;
  }
});

module.exports = TabsStore;
