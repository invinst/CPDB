"use strict";

jest.dontMock('../../../constants/AppConstants');
jest.dontMock('../CheckMarkStore');
jest.dontMock('object-assign');

describe('CheckMarkStore', function() {
  var AppDispatcher;
  var callback;
  var CheckMarkStore;
  var AppConstants = require('../../../constants/AppConstants');

  var actionMouseOut = {
    actionType: AppConstants.OFFICER_MOUSE_OUT,
    officer: { id: 1 }
  };

  var actionActiveOfficer = {
    actionType: AppConstants.SET_ACTIVE_OFFICER,
    officer: { id: 1 }
  };

  beforeEach(function() {
    AppDispatcher = require('../../../dispatcher/AppDispatcher');
    CheckMarkStore = require('../CheckMarkStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });


  it('change `justChange` after SET_ACTIVE_OFFICER/MOUSE_OUT action is triggered', function() {
    callback(actionActiveOfficer);
    expect(CheckMarkStore.getState()['justChange'][1]).toBe(true);
    callback(actionMouseOut);
    expect(CheckMarkStore.getState()['justChange'][1]).toBe(false);
  });
});
