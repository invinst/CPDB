'use strict';

jest.dontMock('../PageTitleStore');
jest.dontMock('lodash');
jest.dontMock('../../constants/AppConstants');
jest.dontMock('../Base');

describe('PageTitleStore', function() {
  var AppDispatcher;
  var callback;
  var PageTitleStore;
  var AppConstants = require('../../constants/AppConstants');

  var actionSetActiveNavItem = {
    actionType: AppConstants.SET_ACTIVE_NAV_ITEM,
    activeItem: 1
  };

  function currentState() {
    return PageTitleStore.getState();
  };

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/AppDispatcher');
    PageTitleStore = require('../PageTitleStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('update `activeItemText` with activeItem text', function() {
    callback(actionSetActiveNavItem);
    expect(currentState()['activeItemText']).toBe(AppConstants.NAVIGATION_ITEMS[1].text);
  });
});
