"use strict";

jest.dontMock('../../../constants/AppConstants');
jest.dontMock('../RelatedOfficersStore');
jest.dontMock('object-assign');

describe('RelatedOfficersStore', function() {
  var AppDispatcher;
  var callback;
  var RelatedOfficersStore;
  var AppConstants = require('../../../constants/AppConstants');

  var actionSetActiveOfficer = {
    actionType: AppConstants.SET_ACTIVE_OFFICER_IN_OFFICER_PAGE,
    officer: {
      id: 1
    } 
  };

  beforeEach(function() {
    AppDispatcher = require('../../../dispatcher/AppDispatcher');
    RelatedOfficersStore = require('../RelatedOfficersStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('toggle officer active state', function() {
    callback(actionSetActiveOfficer);
    expect(RelatedOfficersStore.getState()['activeOfficers'].length).toBe(1);
    callback(actionSetActiveOfficer);
    expect(RelatedOfficersStore.getState()['activeOfficers'].length).toBe(0);    
  });
});
