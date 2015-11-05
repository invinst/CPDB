'use strict';

jest.dontMock('lodash');
jest.dontMock('../../../Base');
jest.dontMock('../NewSessionPerDayChartStore');
jest.dontMock('../../../../constants/AppConstants');

describe('NewSessionPerDayChartStore', function() {
  var AppDispatcher;
  var callback;
  var NewSessionPerDayChartStore;
  var AppConstants = require('../../../../constants/AppConstants');

  var actionReceivedData = {
    actionType: AppConstants.RECEIVED_NEW_SESSIONS_DATA,
    data: {
      results: [
        {
          created_date: '2011-01-01',
          count: 1
        }
      ]
    }
  };

  beforeEach(function() {
    AppDispatcher = require('../../../../dispatcher/AppDispatcher');
    NewSessionPerDayChartStore = require('../NewSessionPerDayChartStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('update state data correctly when received data from API', function() {
    callback(actionReceivedData);
    expect(NewSessionPerDayChartStore.getState()['chartData']['datasets'][0]['data']).toEqual([1]);
    expect(NewSessionPerDayChartStore.getState()['chartData']['labels']).toEqual(['2011-01-01']);
  });
});
