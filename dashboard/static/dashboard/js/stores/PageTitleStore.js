var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var Base = require('./Base.js');

var PageTitleStore = _.assign(Base({ activeItemText: ''}), {
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
  case AppConstants.SET_ACTIVE_NAV_ITEM:
    PageTitleStore.updateState('activeItemText', AppConstants.NAVIGATION_ITEMS[action.activeItem].text);
    break;
  default:
    break;
  }
  PageTitleStore.emitChange();
});

module.exports = PageTitleStore;
