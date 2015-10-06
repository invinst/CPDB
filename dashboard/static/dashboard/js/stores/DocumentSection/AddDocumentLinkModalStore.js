var Base = require('../Base');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var _ = require('lodash');

var _state = {
  isOpen: false,
  formValid: false,
  link: '',
  suppliedCrid: '',
  crid: '',
  flashMessage: '',
  errorMessages: []
};

var AddDocumentLinkModalStore = _.assign(Base(_state), {
  validFormData: function() {
    if (_.isEmpty(_state['link'])) {
      this.updateState('formValid', false);
    } else {
      this.updateState('formValid', true);
    }
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
  case AppConstants.SHOW_ADD_DOCUMENT_LINK_MODAL:
    AddDocumentLinkModalStore.updateState('isOpen', true);
    AddDocumentLinkModalStore.updateState('formValid', false);
    AddDocumentLinkModalStore.updateState('link', '');
    AddDocumentLinkModalStore.updateState('suppliedCrid', action.crid);
    AddDocumentLinkModalStore.updateState('crid', '');
    AddDocumentLinkModalStore.updateState('flashMessage', '');
    AddDocumentLinkModalStore.updateState('errorMessages', []);
    AddDocumentLinkModalStore.emitChange();
    break;

  case AppConstants.HIDE_ADD_DOCUMENT_LINK_MODAL:
    AddDocumentLinkModalStore.updateState('isOpen', false);
    AddDocumentLinkModalStore.updateState('flashMessage', '');
    AddDocumentLinkModalStore.updateState('errorMessages', []);
    AddDocumentLinkModalStore.emitChange();
    break;

  case AppConstants.DOCUMENT_LINK_ADDED:
    AddDocumentLinkModalStore.updateState('isOpen', false);
    var msg = 'The document is successfully added to allegation #'+action.crid+'!';
    AddDocumentLinkModalStore.updateState('flashMessage', msg);
    AddDocumentLinkModalStore.updateState('errorMessages', []);
    AddDocumentLinkModalStore.emitChange();
    break;

  case AppConstants.FAILED_ADD_DOCUMENT_LINK:
    AddDocumentLinkModalStore.updateState('isOpen', true);
    AddDocumentLinkModalStore.updateState('errorMessages', ['Invalid link! Please check URL']);
    AddDocumentLinkModalStore.emitChange();
    break;

  case AppConstants.DOCUMENT_LINK_MODAL_FORM_DATA_CHANGED:
    AddDocumentLinkModalStore.updateState('errorMessages', []);
    AddDocumentLinkModalStore.updateState(action.stateName, action.stateValue);
    AddDocumentLinkModalStore.validFormData();
    AddDocumentLinkModalStore.emitChange();
  }
});

module.exports = AddDocumentLinkModalStore;
