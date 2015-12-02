var Base = require('../Base');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var _ = require('lodash');
var toastr = require('toastr');

var _state = {
  isOpen: false,
  formValid: false,
  alias: '',
  target: '',
  flashMessage: '',
  errorMessages: []
};

var AddAliasModalStore = _.assign(Base(_state), {
  validFormData: function() {
    if (_.isEmpty(_state['alias']) || _.isEmpty(_state['target'])) {
      this.updateState('formValid', false);
    } else {
      this.updateState('formValid', true);
    }
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
  case AppConstants.SHOW_ADD_ALIAS_MODAL:
    var alias = (action.data && action.data.alias) ? action.data.alias : '';
    var target = (action.data && action.data.target) ? action.data.target : '';
    AddAliasModalStore.updateState('isOpen', true);
    AddAliasModalStore.updateState('formValid', false);
    AddAliasModalStore.updateState('flashMessage', '');
    AddAliasModalStore.updateState('errorMessages', []);
    AddAliasModalStore.updateState('alias', alias);
    AddAliasModalStore.updateState('target', target);
    AddAliasModalStore.emitChange();
    break;

  case AppConstants.HIDE_ADD_ALIAS_MODAL:
    AddAliasModalStore.updateState('isOpen', false);
    AddAliasModalStore.updateState('flashMessage', []);
    AddAliasModalStore.emitChange();
    break;

  case AppConstants.RECEIVED_ALIAS_CREATION_RESULT:
    AddAliasModalStore.updateState('isOpen', false);
    toastr.success('Add new alias successfully.');
    AddAliasModalStore.emitChange();
    break;

  case AppConstants.FAILED_TO_CREATE_ALIAS:
    AddAliasModalStore.updateState('isOpen', false);
    toastr.error(action.data);
    AddAliasModalStore.emitChange();
    break;

  case AppConstants.ALIAS_MODAL_FORM_DATA_CHANGED:
    AddAliasModalStore.updateState(action.stateName, action.stateValue);
    AddAliasModalStore.validFormData();
    AddAliasModalStore.emitChange();
  }
});

module.exports = AddAliasModalStore;
