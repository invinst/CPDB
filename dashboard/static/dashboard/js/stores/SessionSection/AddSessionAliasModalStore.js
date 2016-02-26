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
  title: '',
  flashMessage: '',
  errorMessages: [],
  newTarget: false
};


var AddSessionAliasModalStore = _.assign(Base(_state), {
  validFormData: function () {
    if (_.isEmpty(_state['alias']) || !_state['target']) {
      this.updateState('formValid', false);
    } else {
      this.updateState('formValid', true);
    }
  }
});

AppDispatcher.register(function (action) {
  var alias,
    target,
    newTarget;

  switch (action.actionType) {
    case AppConstants.SHOW_ADD_SESSION_ALIAS_MODAL:
      alias = (action.data && action.data.alias) ? action.data.alias : '';
      target = (action.data && action.data.target) ? action.data.target : '';
      newTarget = target ? false : true;

      _state.isOpen = true;
      _state.formValid = false;
      _state.flashMessage = '';
      _state.errorMessages = [];
      _state.alias = alias;
      _state.target = target;
      _state.newTarget = newTarget;

      AddSessionAliasModalStore.emitChange();
      break;

    case AppConstants.HIDE_ADD_SESSION_ALIAS_MODAL:
      _state.isOpen = false;
      _state.flashMessage = [];
      _state.newTarget = false;
      AddSessionAliasModalStore.emitChange();
      break;

    case AppConstants.RECEIVED_SESSION_ALIAS_CREATION_RESULT:
      _state.isOpen = false;
      toastr.success('Add new alias successfully.');
      AddSessionAliasModalStore.emitChange();
      break;

    case AppConstants.FAILED_TO_CREATE_SESSION_ALIAS:
      _state.isOpen = false;
      toastr.error(action.data);
      AddSessionAliasModalStore.emitChange();
      break;

    case AppConstants.SESSION_ALIAS_MODAL_FORM_DATA_CHANGED:
      _state[action.stateName] = action.stateValue;
      AddSessionAliasModalStore.validFormData();
      AddSessionAliasModalStore.emitChange();
  }
});

module.exports = AddSessionAliasModalStore;
