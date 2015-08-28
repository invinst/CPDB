var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var navigate = require('react-mini-router').navigate;

var _state = {
};


var ContentStore = assign({}, EventEmitter.prototype, {
  getState: function() {
    return _state;
  },

  addChangeListener: function (callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(AppConstants.CHANGE_EVENT);
  },

  changePageContent: function (activePage) {
    var page = AppConstants.NAVIGATION_ITEMS[activePage];
    navigate(page['page']);
  }
});


AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SET_ACTIVE_NAV_ITEM:
      ContentStore.changePageContent(action.activeItem);
      break;

    default:
      break;
  }
});

module.exports = ContentStore;
