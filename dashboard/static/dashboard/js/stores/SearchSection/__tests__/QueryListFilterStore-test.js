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
  var key = 'key';

  var actionSetActiveItem = {
    actionType: AppConstants.SET_QUERY_LIST_ACTIVE_ITEM,
    data: key
  };

  function currentState() {
    return QueryListFilterStore.getState();
  };

  beforeEach(function() {
    AppDispatcher = require('../../../dispatcher/AppDispatcher');
    QueryListFilterStore = require('../QueryListFilterStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('should change the active item', function() {
    expect(currentState()['activeItem']).toEqual('all');
    callback(actionSetActiveItem);
    expect(currentState()['activeItem']).toEqual(key);
  });
});
