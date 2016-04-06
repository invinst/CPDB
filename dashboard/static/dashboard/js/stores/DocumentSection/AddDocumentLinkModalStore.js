var _ = require('lodash');

var Base = require('stores/Base');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');


var _state = {
  isOpen: false,
  link: '',
  document: {},
  isSubmitting: false
};

var AddDocumentLinkModalStore = _.assign(Base(_state), {
  isFormValid: function () {
    return !_.isEmpty(_state.link);
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SHOW_ADD_DOCUMENT_LINK_MODAL:
      AddDocumentLinkModalStore.updateState('isOpen', true);
      AddDocumentLinkModalStore.updateState('link', '');
      AddDocumentLinkModalStore.updateState('document', action.document);
      AddDocumentLinkModalStore.emitChange();
      break;

    case AppConstants.HIDE_ADD_DOCUMENT_LINK_MODAL:
      AddDocumentLinkModalStore.updateState('isOpen', false);
      AddDocumentLinkModalStore.updateState('link', '');
      AddDocumentLinkModalStore.emitChange();
      break;

    case AppConstants.DOCUMENT_LINK_ADDED:
      AddDocumentLinkModalStore.updateState('isOpen', false);
      AddDocumentLinkModalStore.updateState('isSubmitting', false);
      AddDocumentLinkModalStore.emitChange();
      break;

    case AppConstants.FAILED_ADD_DOCUMENT_LINK:
      AddDocumentLinkModalStore.updateState('isOpen', true);
      AddDocumentLinkModalStore.updateState('isSubmitting', false);
      AddDocumentLinkModalStore.emitChange();
      break;

    case AppConstants.DOCUMENT_LINK_MODAL_FORM_DATA_CHANGED:
      AddDocumentLinkModalStore.updateState(action.stateName, action.stateValue);
      AddDocumentLinkModalStore.emitChange();
      break;

    case AppConstants.SUBMITTING_DOCUMENT_LINK:
      AddDocumentLinkModalStore.updateState('isSubmitting', true);
      AddDocumentLinkModalStore.emitChange();
      break;
  }
});

module.exports = AddDocumentLinkModalStore;
