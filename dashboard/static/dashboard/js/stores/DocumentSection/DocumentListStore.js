var _ = require('lodash');
var navigate = require('react-mini-router').navigate;

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var Base = require('../Base');

var _state = {
  documents: [],
  locked: false
};

var DocumentListStore = _.assign(Base(_state), {
  init: function (params) {
    _.extend(_state, params);
    return this.getState();
  },
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_DOCUMENT_LIST:
      _state.documents = action.data;
      DocumentListStore.emitChange();
      break;

    case AppConstants.RECEIVED_MORE_DOCUMENT_RESULTS_DATA:
      if (!_.isEmpty(action.data)) {
        _state.documents = _state.documents.concat(action.data);
        _state.locked = false;
        DocumentListStore.emitChange();
      }
      break;

    case AppConstants.LOCK_SCROLL_DOCUMENT_LIST:
      _state.locked = true;
      DocumentListStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = DocumentListStore;
