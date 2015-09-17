'use strict';

jest.dontMock('lodash');
jest.dontMock('../../Base');
jest.dontMock('../QueryListStore');
jest.dontMock('../../../constants/AppConstants');

describe('QueryListStore', function() {
  var AppDispatcher;
  var callback;
  var QueryListStore;
  var AppConstants = require('../../../constants/AppConstants');

  var actionReceivedQueriesData = {
    actionType: AppConstants.RECEIVED_QUERIES_DATA,
    data: {
      logs: 'logs',
      log_counts: 'logCounts'
    }
  };

  beforeEach(function() {
    AppDispatcher = require('../../../dispatcher/AppDispatcher');
    QueryListStore = require('../QueryListStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('get the data from the API', function (){
    callback(actionReceivedQueriesData);
    expect(QueryListStore.getState()['logs']).toBe('logs');
    expect(QueryListStore.getState()['logCounts']).toBe('logCounts');

  });
});
