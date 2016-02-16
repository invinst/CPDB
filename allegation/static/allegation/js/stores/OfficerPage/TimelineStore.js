var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');

var _state = {
  data: null
};

var TimelineStore = _.assign(Base(_state), {

});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_TIMELINE_DATA:
      _state.data = action.data;
      TimelineStore.emitChange();
      break;

    case AppConstants.RECEIVED_INVESTIGATOR_DATA:
      _state.data = {items: action.data.timeline};
      TimelineStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = TimelineStore;
