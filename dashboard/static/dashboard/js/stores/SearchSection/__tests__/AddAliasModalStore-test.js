'use strict';

jest.dontMock('lodash');
jest.dontMock('../../Base');
jest.dontMock('../AddAliasModalStore');
jest.dontMock('../../../constants/AppConstants');

describe('AddAliasModalStore', function() {
  var AppDispatcher;
  var callback;
  var AddAliasModalStore;
  var AppConstants = require('../../../constants/AppConstants');

  var actionShowAddAliasModal = {
    actionType: AppConstants.SHOW_ADD_ALIAS_MODAL
  };

  var actionHideAddAliasModal = {
    actionType: AppConstants.HIDE_ADD_ALIAS_MODAL
  };

  var actionReceivedAliasCreationResult = {
    actionType: AppConstants.RECEIVED_ALIAS_CREATION_RESULT
  };

  var actionUpdateFormData = function(stateName, stateValue) {
    return {
      actionType: AppConstants.ALIAS_MODAL_FORM_DATA_CHANGED,
      stateName: stateName,
      stateValue: stateValue
    };
  };

  var actionFailedToCreateAlias = function(errorMessage) {
    return {
      actionType: AppConstants.FAILED_TO_CREATE_ALIAS,
      data: errorMessage
    };
  };

  function currentState() {
    return AddAliasModalStore.getState();
  };

  beforeEach(function() {
    AppDispatcher = require('../../../dispatcher/AppDispatcher');
    AddAliasModalStore = require('../AddAliasModalStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('change `isOpen` state when receive SHOW/HIDE events', function() {
    expect(currentState()['isOpen']).toEqual(false);
    callback(actionShowAddAliasModal);
    expect(currentState()['isOpen']).toEqual(true);
    callback(actionHideAddAliasModal);
    expect(currentState()['isOpen']).toEqual(false);
  });

  it('close the modal and set successful message when alias is created', function() {
    AddAliasModalStore.updateState('isOpen', true);
    callback(actionReceivedAliasCreationResult);
    expect(currentState()['isOpen']).toEqual(false);
    expect(currentState()['flashMessage']).toEqual(['Add new alias successfully.']);
  });

  it('close the modal and set error message when alias is failed to create', function() {
    var errorMessage = 'errorMessage';
    AddAliasModalStore.updateState('isOpen', true);
    callback(actionFailedToCreateAlias(errorMessage));
    expect(currentState()['isOpen']).toEqual(false);
    expect(currentState()['errorMessages']).toEqual(errorMessage);
  });

  it('update form data and validate it', function() {
    var alias = 'alias';
    var target = 'target';

    callback(actionUpdateFormData('alias', alias));
    expect(currentState()['alias']).toEqual(alias);
    expect(currentState()['formValid']).toBe(false);
    callback(actionUpdateFormData('target', target));
    expect(currentState()['target']).toEqual(target);
    expect(currentState()['formValid']).toBe(true);
  });
});
