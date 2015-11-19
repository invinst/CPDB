var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Base = require('../stores/Base');


var INIT_DATA_TOOL_EVENT = 'INIT_DATA_TOOL_EVENT';


var _state = {
  isDataToolInit: false,
  page: 'data',
};

var AppStore = _.assign(Base(_state), {
  isDataToolInit: function () {
    return _state.isDataToolInit;
  },

  updatePage: function (page) {
    _state.page = page;
    this.emitChange();
  },

  removeDataToolInitListener: function(callback) {
    this.removeListener(INIT_DATA_TOOL_EVENT, callback);
  },

  addDataToolInitListener: function (callback) {
    this.on(INIT_DATA_TOOL_EVENT, callback);
  },

  emitDataToolInit: function () {
    this.emit(INIT_DATA_TOOL_EVENT);
  },

  isStoryPage: function () {
    return _state.page == 'story';
  },

  isFindingPage: function () {
    return _state.page == 'findings';
  },

  isDataToolPage: function () {
    return _state.page == 'data';
  }

});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.INIT_DATA_TOOL:
      if (!_state.isDataToolInit) {
        _state.isDataToolInit = true;
        AppStore.emitDataToolInit();
      }
      break;

    case AppConstants.NAV_GO_TO_PAGE:
      _state.page = action.page;
      AppStore.emitChange();

    default:
      break;
  }
});

module.exports = AppStore;
