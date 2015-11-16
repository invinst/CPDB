"use strict";

jest.dontMock('../../constants/AppConstants');
jest.dontMock('../ComplaintListStore');
jest.dontMock('object-assign');

describe('ComplaintListStore', function() {
  var AppDispatcher;
  var callback;
  var ComplaintListStore;
  var AppConstants = require('../../constants/AppConstants');

  var actionComplaintListGetData = {
    actionType: AppConstants.COMPLAINT_LIST_GET_DATA
  };

  var actionComplaintListReceivedData = {
    actionType: AppConstants.COMPLAINT_LIST_RECEIVED_DATA,
    data: {}
  };

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/AppDispatcher');
    ComplaintListStore = require('../ComplaintListStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });
});
