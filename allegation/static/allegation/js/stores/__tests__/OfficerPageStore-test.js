"use strict";

jest.dontMock('../../constants/AppConstants');
jest.dontMock('stores/OfficerPageStore');
jest.dontMock('object-assign');

describe('OfficerPageStore', function() {
  var AppDispatcher;
  var callback;
  var OfficerPageStore;
  var AppConstants = require('../../constants/AppConstants');

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/AppDispatcher');
    OfficerPageStore = require('stores/OfficerPageStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });
});
