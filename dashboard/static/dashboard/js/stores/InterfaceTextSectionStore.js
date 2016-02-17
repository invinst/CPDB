var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');
var Base = require('./Base');
var navigate = require('react-mini-router').navigate;

var _state = {
  texts: [],
  activeText: null,
};

var InterfaceTextSectionStore = _.assign(Base(_state), {
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_INTERFACE_TEXTS:
      InterfaceTextSectionStore.updateState('texts', action.data);
      InterfaceTextSectionStore.emitChange();
      break;

    case AppConstants.UPDATE_INTERFACE_TEXTS:
      _state.activeTexts = null;
      for (var i = 0; i < _state.texts.length; i++) {
        if (_state.texts[i].id == action.data.id) {
          _state.texts[i] = action.data;
        }
      }
      InterfaceTextSectionStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = InterfaceTextSectionStore;
