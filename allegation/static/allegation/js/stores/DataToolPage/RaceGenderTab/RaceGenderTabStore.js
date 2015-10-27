var _ = require('lodash');

var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');
var Base = require('stores/Base');

var _state = {
  'data': {
  }
};

var RaceGenderTabStore = _.assign(Base(_state), {});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
  case AppConstants.RACE_GENDER_TAB_RECEIVED_DATA:
    RaceGenderTabStore.updateState('data', action.data);
    RaceGenderTabStore.emitChange();
    break;

  default:
    break;
  }
});

module.exports = RaceGenderTabStore;
