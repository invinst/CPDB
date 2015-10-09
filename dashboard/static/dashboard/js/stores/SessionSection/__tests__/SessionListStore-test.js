'use strict';

jest.dontMock('lodash');
jest.dontMock('../../../dispatcher/AppDispatcher');
jest.dontMock('../../Base');
jest.dontMock('stores/SessionSection/SessionListStore');
jest.dontMock('../../../constants/AppConstants');

describe('SessionListStore', function() {
  var AppDispatcher;
  var callback;
  var SessionListStore;
  var AppConstants = require('../../../constants/AppConstants');

  var actionReceivedData = {
    actionType: AppConstants.RECEIVED_SESSIONS_DATA,
    data: { results: ['data'] }
  };

  var actionLoadMoreData = {
    actionType: AppConstants.RECEIVED_MORE_SESSIONS_DATA,
    data: ['more_data']
  };

  var actionLoadMoreDataWithNothingComing = {
    actionType: AppConstants.RECEIVED_MORE_SESSIONS_DATA,
    data: []
  };

  var actionLockScroll = {
    actionType: AppConstants.LOCK_SESSION_PAGE_SCROLL
  };


  beforeEach(function() {
    AppDispatcher = require('../../../dispatcher/AppDispatcher');
    SessionListStore = require('stores/SessionSection/SessionListStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('get the data from the API', function (){
    callback(actionReceivedData);

    expect(SessionListStore.getState()['data']).toEqual(['data']);
  });

  it('merge the data when loadding more from the API', function (){
    callback(actionReceivedData);
    callback(actionLoadMoreData);

    expect(SessionListStore.getState()['data']).toEqual(['data', 'more_data']);
    expect(SessionListStore.getState()['locked']).toBe(false);
  });

  it('do nothing when there is no new data from API', function (){
    var page = SessionListStore.getState()['page'];
    callback(actionReceivedData);
    callback(actionLockScroll);
    callback(actionLoadMoreDataWithNothingComing);

    expect(SessionListStore.getState()['data']).toEqual(['data']);
    expect(SessionListStore.getState()['locked']).toBe(true);
  });

  it('enable scroll lock when `LOCK_SCROLL`', function (){
    callback(actionLockScroll);
    expect(SessionListStore.getState()['locked']).toBe(true);
  });

});
