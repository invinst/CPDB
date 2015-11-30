var Base = require('../Base');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var _ = require('lodash');

var _state = {
  isOpen: false,
  formValid: false,
  alias: '',
  target: '',
  flashMessage: '',
  errorMessages: []
};

var AddSessionAliasModalStore = _.assign(Base(_state), {
  validFormData: function() {
    if (_.isEmpty(_state['alias']) || !_state['target']) {
      this.updateState('formValid', false);
    } else {
      this.updateState('formValid', true);
    }
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
  case AppConstants.SHOW_ADD_SESSION_ALIAS_MODAL:
    var alias = (action.data && action.data.alias) ? action.data.alias : '';
    var target = (action.data && action.data.target) ? action.data.target : '';
    AddSessionAliasModalStore.updateState('isOpen', true);
    AddSessionAliasModalStore.updateState('formValid', false);
    AddSessionAliasModalStore.updateState('flashMessage', '');
    AddSessionAliasModalStore.updateState('errorMessages', []);
    AddSessionAliasModalStore.updateState('alias', alias);
    AddSessionAliasModalStore.updateState('target', target);
    AddSessionAliasModalStore.emitChange();
    break;

  case AppConstants.HIDE_ADD_SESSION_ALIAS_MODAL:
    AddSessionAliasModalStore.updateState('isOpen', false);
    AddSessionAliasModalStore.updateState('flashMessage', []);
    AddSessionAliasModalStore.emitChange();
    break;

  case AppConstants.RECEIVED_SESSION_ALIAS_CREATION_RESULT:
    AddSessionAliasModalStore.updateState('isOpen', false);
    AddSessionAliasModalStore.updateState('flashMessage', ['Add new alias successfully.']);
    AddSessionAliasModalStore.emitChange();
    break;

  case AppConstants.FAILED_TO_CREATE_SESSION_ALIAS:
    AddSessionAliasModalStore.updateState('isOpen', false);
    AddSessionAliasModalStore.updateState('errorMessages', action.data);
    AddSessionAliasModalStore.emitChange();
    break;

  case AppConstants.SESSION_ALIAS_MODAL_FORM_DATA_CHANGED:
    AddSessionAliasModalStore.updateState(action.stateName, action.stateValue);
    AddSessionAliasModalStore.validFormData();
    AddSessionAliasModalStore.emitChange();
  }
});

module.exports = AddSessionAliasModalStore;
