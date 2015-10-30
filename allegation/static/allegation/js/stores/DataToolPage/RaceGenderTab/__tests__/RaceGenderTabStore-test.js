"use strict";

jest.dontMock('../../../../constants/AppConstants');
jest.dontMock('../RaceGenderTabStore');
jest.dontMock('../../../Base');
jest.dontMock('lodash');


describe('RaceGenderTabStore', function() {
  var AppDispatcher;
  var callback;
  var RaceGenderTabStore;
  var AppConstants = require('../../../../constants/AppConstants');

  var actionReceivedData = {
    actionType: AppConstants.RACE_GENDER_TAB_RECEIVED_DATA,
    data: 'data'
  };

  beforeEach(function() {
    AppDispatcher = require('../../../../dispatcher/AppDispatcher');
    RaceGenderTabStore = require('../RaceGenderTabStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('change loading to true when getting data', function() {
    callback(actionReceivedData);
    expect(RaceGenderTabStore.getState()['data']).toBe('data');
  });
});
