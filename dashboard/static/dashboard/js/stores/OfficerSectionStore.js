var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');
var Base = require('./Base');
var navigate = require('react-mini-router').navigate;

var _state = {
  id: null
};

var OfficerSectionStore = _.assign(Base(_state), {
  init: function (params) {
    _.extend(_state, params);
    return this.getState();
  },
  navigateMain: function () {
    navigate('/officer');
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_OFFICER_LIST:
      OfficerSectionStore.navigateMain();
      break;

    default:
      break;
  }
});

module.exports = OfficerSectionStore;
