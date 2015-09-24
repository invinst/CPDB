var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var _ = require('lodash');
var Base = require('../Base');
var navigate = require('react-mini-router').navigate;

var _state = {
  officer: null,
  originOfficer: null,
  method: 'storyForm'
};

var OfficerStore = _.assign(Base(_state), {
  navigateOfficer: function (id) {
    navigate('/officer?id=' + id);
  },
  setOfficer: function (officer) {
    this.updateState('officer', officer);
    this.emitChange();
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.SET_ACTIVE_OFFICER:
      OfficerStore.navigateOfficer(action.data.id);
      OfficerStore.setOfficer(action.data);
      break;

    case AppConstants.RECEIVE_OFFICER:
      OfficerStore.setOfficer(action.data);
      break;

    case AppConstants.SET_OFFICER_TAB_ACTIVE:
      OfficerStore.updateState('method', action.data);
      OfficerStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = OfficerStore;
