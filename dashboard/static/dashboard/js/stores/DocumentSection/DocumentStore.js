var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var _ = require('lodash');
var Base = require('../Base');

var _state = {
  document: {},
  documentType: 'CR'
};

var DocumentStore = _.assign(Base(_state), {
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_DOCUMENT:
    case AppConstants.SET_ACTIVE_ALLEGATION:
      _state.document = action.data;
      DocumentStore.emitChange();
      break;

    case AppConstants.DOCUMENT_REQUEST_CANCEL:
      action.data['requested'] = false;
      DocumentStore.emitChange();
      break;

    case AppConstants.DOCUMENT_PUT_TO_PENDING:
      action.data['pending'] = true;
      DocumentStore.emitChange();
      break;

    case AppConstants.SET_ACTIVE_DOCUMENT_TYPE_TAB:
      _state.documentType = action.data;
      break;

    default:
      break;
  }
});

module.exports = DocumentStore;
