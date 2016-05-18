var objectAssign = require('object-assign');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var _state = {
  'requested': false,
  'submitFailed': false,
  'errors': {}
};

var RequestStore = objectAssign(Base(_state), {});

RequestStore.dispatcherToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.DOCUMENT_REQUEST_SUCCESS:
      _state['requested'] = true;
      RequestStore.emitChange();
      break;
    case AppConstants.DOCUMENT_REQUEST_FAIL:
      _state['submitFailed'] = true;
      _state['errors'] = action.errors;
      RequestStore.emitChange();
      break;
  }
});

module.exports = RequestStore;
