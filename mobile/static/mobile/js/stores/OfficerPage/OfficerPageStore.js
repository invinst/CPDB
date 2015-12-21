var objectAssign = require('object-assign');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var _state = {
  currentTab: 'summary'
};

var OfficerPageStore = objectAssign(Base(_state), {});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.CHANGE_TAB:
      OfficerPageStore.updateState('currentTab', action.data);
      OfficerPageStore.emitChange();
      break;
    default:

      break;
  }
});

module.exports = OfficerPageStore;
