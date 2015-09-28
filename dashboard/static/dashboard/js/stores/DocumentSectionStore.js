var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');
var Base = require('./Base');
var navigate = require('react-mini-router').navigate;

var _state = {
  documents: []
};

var DocumentSectionStore = _.assign(Base(_state), {
  init: function (params) {
    _.extend(_state, params);
    return this.getState();
  },
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_DOCUMENT_LIST:
      _state.documents = action.data;
      DocumentSectionStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = DocumentSectionStore;
