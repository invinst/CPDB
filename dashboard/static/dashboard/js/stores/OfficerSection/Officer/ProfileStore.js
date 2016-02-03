var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');
var _ = require('lodash');
var Base = require('../../Base');

var _state = {
  officer: null,
  originOfficer: null
};

var ProfileStore = _.assign(Base(_state), {
  setOfficer: function (officer) {
    var clonedOfficer = _.clone(officer);
    this.updateState('officer', clonedOfficer);
    this.updateState('originOfficer', officer);
    this.emitChange();
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SET_ACTIVE_OFFICER:
    case AppConstants.RECEIVE_OFFICER:
      ProfileStore.setOfficer(action.data);
      break;

    case AppConstants.UPDATE_OFFICER_DATA:
      _state.officer[action.field] = action.value;
      ProfileStore.emitChange();
      break;

    case AppConstants.RESET_OFFICER_DATA:
      _state.officer = _.clone(_state.originOfficer);
      ProfileStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = ProfileStore;
