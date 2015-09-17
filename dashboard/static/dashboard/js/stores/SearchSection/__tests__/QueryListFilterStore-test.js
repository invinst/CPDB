'use strict';

jest.dontMock('lodash');
jest.dontMock('../../Base');
jest.dontMock('../QueryListFilterStore');
jest.dontMock('../../../constants/AppConstants');

describe('QueryListFilterStore', function() {
  var AppDispatcher;
  var callback;
  var QueryListFilterStore;
  var AppConstants = require('../../../constants/AppConstants');

  var actionReceivedQueriesData = {
  };

  beforeEach(function() {
    AppDispatcher = require('../../../dispatcher/AppDispatcher');
    QueryListFilterStore = require('../QueryListFilterStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });
});
