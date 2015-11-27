var _ = require('lodash');

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var isMobile = require('ismobilejs');
var Base = require('../Base');

function defaultTab() {
  return isMobile.any ? 'map' : 'outcomes'
}

function ifNotMobileChangeMapToOutcome(tab) {
  if (!isMobile.any && tab == 'map')
    return 'outcomes';
  return tab;
}

var _state = {
  'active_tab': defaultTab()
};

var TabsStore = _.assign(Base(_state), {
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
  case AppConstants.RECEIVED_SESSION_DATA:
    if (action.data.data.active_tab) {
      _state['active_tab'] = ifNotMobileChangeMapToOutcome(action.data.data.active_tab);
    }
    TabsStore.emitChange();
    break;

  default:
    break;
  }
});

module.exports = TabsStore;
