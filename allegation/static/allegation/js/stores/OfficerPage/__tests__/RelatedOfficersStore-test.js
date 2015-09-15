"use strict";

jest.dontMock('../../../constants/MapConstants');
jest.dontMock('../RelatedOfficersStore');
jest.dontMock('object-assign');

describe('RelatedOfficersStore', function() {
  var AppDispatcher;
  var callback;
  var RelatedOfficersStore;
  var MapConstants = require('../../../constants/MapConstants');

  var actionSetActiveOfficer = {
    actionType: MapConstants.SET_ACTIVE_OFFICER,
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
