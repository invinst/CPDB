var objectAssign = require('object-assign');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var _state = {
  'pk': '',
  'loading': false,
  'found': false,
  'complaint': {}
};

var OfficerPageStore = objectAssign(Base(_state), {});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.OFFICER_PAGE_RECEIVED_DATA:
      _state['officer'] = action.data;
      _state['pk'] = action.data['detail']['id'];
      _state['found'] = true;
      _state['loading'] = false;
      OfficerPageStore.emitChange();
      break;

    case AppConstants.OFFICER_PAGE_FAILED_TO_RECEIVED_DATA:
      _state['pk'] = action.data;
      _state['found'] = false;
      _state['loading'] = false;
      OfficerPageStore.emitChange();
      break;

    case AppConstants.OFFICER_PAGE_RELOAD:
      _state['loading'] = true;
      OfficerPageStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = OfficerPageStore;
