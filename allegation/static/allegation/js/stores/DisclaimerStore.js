var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Base = require('stores/Base');

var _state = {
  show: false
};

var DisclaimerStore = _.assign(Base(_state), {

});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SHOW_DISCLAIMER:
      _state.show = true;
      DisclaimerStore.emitChange();
      break;

    case AppConstants.DISCLAIMER_HIDDEN:
      _state.show = false;
      DisclaimerStore.emitChange();
      break;

    default: break;
  }
});

module.exports = DisclaimerStore;
