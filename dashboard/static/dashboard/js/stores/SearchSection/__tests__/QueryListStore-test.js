'use strict';

jest.dontMock('lodash');
jest.dontMock('../../../dispatcher/AppDispatcher');
jest.dontMock('../../Base');
jest.dontMock('../QueryListStore');
jest.dontMock('../../../constants/AppConstants');

describe('QueryListStore', function() {
  var AppDispatcher;
  var callback;
  var QueryListStore;
  var AppConstants = require('../../../constants/AppConstants');
  var data = {
    logs: [
      {
        query: 'query1',
        num_suggestions: 0
      },
      {
        query: 'query2',
        num_suggestions: 1
      }
    ]
  };
  var actionReceivedQueriesData = {
    actionType: AppConstants.RECEIVED_SEARCH_RESULTS_DATA,
    data: ['data']
  };

  var actionLoadMoreResultsData = {
    actionType: AppConstants.LOAD_MORE_SEARCH_RESULTS_DATA,
    data: ['more_data']
  };

  var actionLoadMoreResultsDataWithNoData = {
    actionType: AppConstants.LOAD_MORE_SEARCH_RESULTS_DATA,
    data: []
  };

  var actionLockScroll = {
    actionType: AppConstants.LOCK_SCROLL
  };

  var actionQueryListSetActiveItem = function (key) {
    return {
      actionType: AppConstants.SET_QUERY_LIST_ACTIVE_ITEM,
      data: key
    };
  };

  var actionSortQueryList = function(sortBy) {
    return {
      actionType: AppConstants.SORT_QUERY_LIST,
      data: sortBy
    };
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

    expect(QueryListStore.getState()['data']).toEqual(['data']);
  });

  it('merge the data when loadding more from the API', function (){
    var page = QueryListStore.getState()['page'];
    callback(actionReceivedQueriesData);
    callback(actionLoadMoreResultsData);

    expect(QueryListStore.getState()['data']).toEqual(['data', 'more_data']);
    expect(QueryListStore.getState()['locked']).toBe(false);
    expect(QueryListStore.getState()['page']).toBe(page + 1);
  });

  it('do nothing when there is no new data from API', function (){
    var page = QueryListStore.getState()['page'];
    callback(actionReceivedQueriesData);
    callback(actionLockScroll);
    callback(actionLoadMoreResultsDataWithNoData);

    expect(QueryListStore.getState()['data']).toEqual(['data']);
    expect(QueryListStore.getState()['locked']).toBe(true);
    expect(QueryListStore.getState()['page']).toBe(page);
  });

  it('enable scroll lock when `LOCK_SCROLL`', function (){
    callback(actionLockScroll);
    expect(QueryListStore.getState()['locked']).toBe(true);
  });

  it('set sort control on `SORT_QUERY_LIST`', function() {
    var sortBy = 'sortBy';
    callback(actionSortQueryList(sortBy));
    expect(QueryListStore.getSortOrder()).toBe('-' + sortBy);
    callback(actionSortQueryList(sortBy));
    expect(QueryListStore.getSortOrder()).toBe(sortBy);
  });
});
