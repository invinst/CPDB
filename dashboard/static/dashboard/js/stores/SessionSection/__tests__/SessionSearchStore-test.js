'use strict';

jest.dontMock('lodash');
jest.dontMock('../../../dispatcher/AppDispatcher');
jest.dontMock('../../Base');
jest.dontMock('stores/SessionSection/SessionSearchStore');
jest.dontMock('../../../constants/AppConstants');

describe('SessionSearchStore', function() {
  var AppDispatcher;
  var callback;
  var SessionSearchStore;
  var AppConstants = require('../../../constants/AppConstants');

  var actionSessionSearchFor = {
    actionType: AppConstants.SEARCH_FOR_SESSION,
    data: 'query'
  };


  beforeEach(function() {
    AppDispatcher = require('../../../dispatcher/AppDispatcher');
    SessionSearchStore = require('stores/SessionSection/SessionSearchStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('get the data from the API', function (){
    callback(actionSessionSearchFor);

    expect(SessionSearchStore.getState()['query']).toEqual('query');
  });
});
