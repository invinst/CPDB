var _ = require('lodash');
var Base = require('stores/Base');

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');


var _state = {
  police_witness: []
};

var AllegationStore = _.assign(Base(_state), {
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.ALLEGATION_DETAILS_DATA_RECEIVED:
      _state['police_witness'] = action.data['police_witness'];
      AllegationStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = AllegationStore;
