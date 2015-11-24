var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');


var _state = {
  currentTab: 'officer'
};

var SearchResultSectionStore = _.assign(Base(_state), {});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.CHANGE_TAB:
      _state['currentTab'] = action.data;
      SearchResultSectionStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = SearchResultSectionStore;
