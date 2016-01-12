var objectAssign = require('object-assign');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var _state = {
  'crid': '',
  'loading': false,
  'found': false,
  'complaint': {}
};

var ComplaintPageStore = objectAssign(Base(_state), {});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.COMPLAINT_PAGE_RECEIVED_DATA:
      _state['complaint'] = action.data;
      _state['crid'] = action.data['officer_allegation']['crid'];
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

    default:
      break;
  }
});

module.exports = ComplaintPageStore;
