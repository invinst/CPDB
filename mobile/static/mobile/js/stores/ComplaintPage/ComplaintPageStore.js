var objectAssign = require('object-assign');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var _state = {
  'crid': '',
  'loading': false,
  'found': false,
  'data': {}
};

var ComplaintPageStore = objectAssign(Base(_state), {});

ComplaintPageStore.dispatcherToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.COMPLAINT_PAGE_RECEIVED_DATA:
      _state['data'] = action.data;
      _state['crid'] = action.data['allegation']['crid'];
      _state['found'] = true;
      _state['loading'] = false;
      ComplaintPageStore.emitChange();
      break;

    case AppConstants.COMPLAINT_PAGE_FAILED_TO_RECEIVED_DATA:
      _state['crid'] = action.data;
      _state['found'] = false;
      _state['loading'] = false;
      ComplaintPageStore.emitChange();
      break;
    case AppConstants.COMPLAINT_PAGE_TOGGLE_MENU:
      _state['toggle'] = true;
      ComplaintPageStore.emitChange();
      break;
    case AppConstants.TOGGLE_PAGE_CLOSE:
      _state['toggle'] = false;
      ComplaintPageStore.emitChange();
      break;
    default:
      break;
  }
});

module.exports = ComplaintPageStore;
