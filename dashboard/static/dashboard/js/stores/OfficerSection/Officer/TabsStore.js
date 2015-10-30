var _ = require('lodash');

var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');
var Base = require('../../Base');

var _state = {
  tabs: [{
    text: 'Add story',
    method: 'storyForm'
  }],
  active: 'storyForm'
};

var TabsStore = _.assign(Base(_state), {
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.SET_OFFICER_TAB_ACTIVE:
      TabsStore.updateState('active', action.data);
      TabsStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = TabsStore;
