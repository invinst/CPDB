var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var _ = require('lodash');
var Base = require('../Base');

var _state = {
  officers: false
};

var OfficerListStore = _.assign(Base(_state), {

});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_OFFICER_LIST:
      OfficerListStore.updateState('officers', action.data);
      OfficerListStore.emitChange();
      break;

    case AppConstants.UPDATED_OFFICER_DATA:
      _.extend(action.origin, action.officer);
      OfficerListStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = OfficerListStore;
