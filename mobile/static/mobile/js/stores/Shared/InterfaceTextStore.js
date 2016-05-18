var objectAssign = require('object-assign');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var InterfaceTextStore = objectAssign(Base({
  'loaded': false
}), {});

InterfaceTextStore.dispatcherToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.GET_INTERFACE_TEXT_SUCCESS:
      InterfaceTextStore.updateState('loaded', true);
      InterfaceTextStore.updateState('interfaceTexts', action.interfaceTexts);
      InterfaceTextStore.emitChange();
      break;

    case AppConstants.GET_INTERFACE_TEXT_FAILED:
      InterfaceTextStore.updateState('loaded', false);
      InterfaceTextStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = InterfaceTextStore;
