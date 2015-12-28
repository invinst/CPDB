var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Base = require('../stores/Base');


var _state = {
  'wagtailPages': []
};

var WagtailPagesStore = _.assign(Base(_state), {
  getWagtailPages: function () {
    return _state.wagtailPages;
  }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    default:
      break;
  }
});

module.exports = WagtailPagesStore;
