var _ = require('lodash');

var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');
var Base = require('../../Base');
var AppStore = require('stores/AppStore');

var _state = {
  'data': {
  }
};

var RaceGenderTabStore = _.assign(Base(_state), {
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RACE_GENDER_TAB_RECEIVED_DATA:
      RaceGenderTabStore.updateState('data', action.data);
      if (AppStore.isDataToolInit()) {
        RaceGenderTabStore.emitChange();
      }
      break;

    case AppConstants.INIT_DATA_TOOL:
      RaceGenderTabStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = RaceGenderTabStore;
