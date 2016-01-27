var _ = require ('lodash');
var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Base = require('./Base');

var _state = {
  data: {
    allegations: [],
    officer: {},
    relatedOfficers: [],
    hasMap: false
  }
};

var OfficerPageStore = _.assign(Base(_state), {
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_OFFICER_DATA:
      OfficerPageStore.updateState('data', action.data);
      OfficerPageStore.emitChange();
      break;

    default: break;
  }
});

module.exports = OfficerPageStore;
