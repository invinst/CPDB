var objectAssign = require('object-assign');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var _state = {
  'complaint': {}
};

var ComplaintPageStore = objectAssign(Base(_state), {});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.COMPLAINT_PAGE_RECEIVED_DATA:
      _state['complaint'] = action.data;
      ComplaintPageStore.emitChange();
      break;

    case AppConstants.COMPLAINT_PAGE_FAILED_TO_RECEIVED_DATA:
      // TODO: Handle it later
      break;

    default:
      break;
  }
});

module.exports = ComplaintPageStore;
