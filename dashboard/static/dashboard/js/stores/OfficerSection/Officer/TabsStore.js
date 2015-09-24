var _ = require('lodash');
var navigate = require('react-mini-router').navigate;

var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');
var Base = require('../../Base');

var _state = {
  tabs: [{
    text: 'Add story',
    method: 'storyForm'
  }, {
    text: 'Edit information',
    method: 'officerProfile'
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
