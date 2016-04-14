var ComplaintPageServerActions = require('actions/ComplaintPage/ComplaintPageServerActions');
var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');

require('should');


describe('ComplaintPageServerActions', function () {
  it('dispatch complaint page received data', function () {
    var data = 'data';
    var expectedCall = {
      actionType: AppConstants.COMPLAINT_PAGE_RECEIVED_DATA,
      data: data
    };
    ComplaintPageServerActions.received(data);
    AppDispatcher.dispatch.calledWithMatch(expectedCall).should.be.true();
  });

  it('dispatch failed to received complaint page data', function () {
    var data = 'data';
    var expectedCall = {
      actionType: AppConstants.COMPLAINT_PAGE_FAILED_TO_RECEIVED_DATA,
      data: data
    };
    ComplaintPageServerActions.failedToReceive(data);
    AppDispatcher.dispatch.calledWithMatch(expectedCall).should.be.true();
  });
});
