var _ = require ('lodash');
var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var Base = require('stores/Base');

_state = {
  data: {
    allegations: [],
    investigator: {},
    hasMap: false
  }
};

var InvestigatorPageStore = _.assign(Base(_state), {
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_INVESTIGATOR_DATA:
      _state['data'] = action.data;
      InvestigatorPageStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = InvestigatorPageStore;
