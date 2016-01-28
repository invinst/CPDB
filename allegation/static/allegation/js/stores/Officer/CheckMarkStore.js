var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppConstants = require('../../constants/AppConstants');
var AppDispatcher = require('../../dispatcher/AppDispatcher');

var _state = {
  'justChange': []
};


var CheckMarkStore = assign({}, EventEmitter.prototype, {
  getState: function () {
    return _state;
  },

  getCheckMarkStatus: function(officerId) {
    return _state['justChange'][officerId];
  },

  addChangeListener: function (callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(AppConstants.CHANGE_EVENT);
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.OFFICER_MOUSE_OUT:
      _state.justChange[action.officer.id]= false;
      CheckMarkStore.emitChange();
      break;

    case AppConstants.SET_ACTIVE_OFFICER:
      _state.justChange[action.officer.id] = true;
      CheckMarkStore.emitChange();
      break;

    default:
      break;
  }
});

CheckMarkStore.setMaxListeners(0);

module.exports = CheckMarkStore;
